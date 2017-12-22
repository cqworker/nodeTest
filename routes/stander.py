# encoding=utf-8
# 标准对象
import argparse
import utils
import json

from conf import FILEPATH_TEMPLETE, OPTIONS_FILEPATH_TEMPLETE, VALIDATIONS_FILEPATH_TEMPLETE, CONFIG, STANDARD_OBJECTS, \
    EDIT_META_URL_TEMPLETE
from get_meta import get_all_standard

NEED_FIX_ATTRIBUTES = (
    'nullable',
    'index',
    'unique',
    'searchable',
    'default_value',
    'start_number',
)

NEED_FIX_OPTIONS = (
    'picklist',
    'mpicklist',
    'combox',
    'path'

)


class ColumnOptionsFixer(object):
    def __init__(self):
        self.handlers = {
            '@@category': self.__fix_options_category,
            '@@related': self.__fix_options_related,
            '@@direct': self.__fix_options_direct,
        }

    def make_options(self, options):
        if not isinstance(options, basestring) or len(options) <= 0:
            return options
        option_items = options.split(';')
        handler_name = option_items[0]
        if handler_name in self.handlers:
            return self.handlers[handler_name](option_items)
        return self.__fix_options_default(option_items)

    def __fix_options_default(self, option_items):
        return {'list': {'all': {'options_value': option_items}}}

    def __fix_options_category(self, option_items):
        """
        options格式为: @@category;${csv_filename}
        对应的CSV格式为:
        金融业, 银行
             , 保险
        服务业, 度假
             , 旅游
             , 酒店
        """
        assert len(option_items) >= 2
        csv_filepath = OPTIONS_FILEPATH_TEMPLETE.format(option_items[1])
        csv_rows = utils.load_csv_rows(csv_filepath)
        category_list = [row[0] for row in csv_rows if row[0]]
        return {'list': {'all': {'options_value': category_list}}}

    def __fix_options_related(self, option_items):
        """
        options格式为: @@related;${related_key};${csv_filename}
        对应的CSV格式为:
        金融业, 银行
             , 保险
        服务业, 度假
             , 旅游
             , 酒店
        注意: 要求CSV第一列第一个元素必须不能为空，否则会触发断言错误
        """
        assert len(option_items) >= 3
        related_key = option_items[1]
        csv_filepath = OPTIONS_FILEPATH_TEMPLETE.format(option_items[2])
        csv_rows = utils.load_csv_rows(csv_filepath)
        category_options_map, current_options = {}, None
        for row in csv_rows:
            category_name, option_name = row[0], row[1]
            if category_name and category_name not in category_options_map:
                category_options_map[category_name] = {'options_value': []}
            if category_name:
                current_options = category_options_map[category_name]['options_value']
            # 若CSV文件第一列的第一行为空，则此处current_options会为空，说明CSV文件数据存在错误
            assert isinstance(current_options, list), 'CSV file data error'
            current_options.append(option_name)
        return {'related': related_key, 'list': category_options_map}

    def __fix_options_direct(self, option_items):
        """
        options格式为: @@direct;${csv_filename}
        """
        assert len(option_items) >= 2
        csv_filepath = OPTIONS_FILEPATH_TEMPLETE.format(option_items[1])
        csv_rows = utils.load_csv_rows(csv_filepath)
        options_value = [row[0] for row in csv_rows]
        return {'list': {'all': {'options_value': options_value}}}


class Standard():
    def __init__(self, name, display_name, columns):
        self.name = name
        self.display_name = display_name
        self.options_fixer = ColumnOptionsFixer()
        self.columns = {col_name: self.fix_column(
            column) for col_name, column in columns.items()}
        self.options_column_names = self.get_options_columns()
        self.calculated_column_names = self.get_calculated_columns()
        self.dependency_objects = {col_name: column[
            'object_name'] for col_name, column in self.columns.items() if self.check_dependency(column)}

    def add_validations(self, validations):
        fix_bool = lambda v: True if v == 'true' else False

        for name, validation in validations.items():
            validation['is_valid'] = fix_bool(validation['is_valid'])
            utils.add_validation(self.name, validation)

    def delete_validations(self, validations):
        for name in validations:
            utils.delete_validation(self.name, name)

    def add_trigger(self):
        pass
        # TODO: Bill Balance 使用 trigger
        #       BillItem Quantity等 使用 trigger

    def fix_column(self, column):
        fix_bool = lambda v: True if v == 'true' else False

        if column['type'] in NEED_FIX_OPTIONS:
            column['options'] = self.options_fixer.make_options(column['options'])
        else:
            column.pop('options')

        for attribute in column:
            if attribute in NEED_FIX_ATTRIBUTES:
                if attribute == 'default_value':
                    if column[attribute] == "":
                        column[attribute] = None
                        continue
                    column[attribute] = {'value': column[attribute]}
                    continue
                if attribute == 'start_number':
                    if column[attribute] != '':
                        column[attribute] = int(column[attribute])
                column[attribute] = fix_bool(column[attribute])

        return column

    def check_dependency(self, column):
        return column['type'] in ('lookup', 'master', 'summary')

    def get_options_columns(self):
        name_map = {}
        name_list = []
        for col_name, column in self.columns.items():
            if 'options' not in column:
                continue
            if not isinstance(column['options'], dict):
                name_list.append(col_name)
                continue
            if 'related' not in column['options']:
                name_list.append(col_name)
                continue
            name_map[col_name] = column['options']['related']

        while name_map:
            for col_name, related_name in name_map.items():
                assert (related_name in self.columns)
                assert (related_name in name_list or related_name in name_map)
                if related_name in name_list:
                    name_list.append(col_name)
                    name_map.pop(col_name)
        return name_list

    def get_calculated_columns(self):
        return [col_name for col_name, column in self.columns.items() if column['type'] == 'calculated']

    def store_basic(self):
        if self.name != 'User':
            utils.create_meta(self.name, self.display_name)
        for col_name, column in self.columns.items():
            if col_name in self.dependency_objects:
                continue
            if col_name in self.options_column_names:
                continue
            if col_name in self.calculated_column_names:
                continue
            utils.add_column(self.name, col_name, column)
        for col_name in self.calculated_column_names:
            utils.add_column(self.name, col_name, self.columns[col_name])
        for col_name in self.options_column_names:
            utils.add_column(self.name, col_name, self.columns[col_name])

    def store_dependency(self):
        for col_name in self.dependency_objects:
            utils.add_column(self.name, col_name, self.columns[col_name])

    def delete_columns(self):
        for col_name in self.columns:
            utils.delete_column(self.name, col_name)

    def update_columns(self):
        for col_name in self.columns:
            utils.update_column(self.name, col_name, self.columns[col_name])


def create_standards(args):
    standards = []
    # try:
    for obj_name, display_name in STANDARD_OBJECTS:
        filename = FILEPATH_TEMPLETE.format(obj_name)
        meta_info = utils.load_csv(filename)
        standards.append(Standard(obj_name, display_name, meta_info))
    # except Exception as e:
    #     print(u"{},请检查conf.json中objects项配置".format(e))
    if 'meta' in args:
        for standard in standards:
            standard.store_basic()

        for standard in standards:
            standard.store_dependency()

    if 'validation' in args:
        for standard in standards:
            filename = VALIDATIONS_FILEPATH_TEMPLETE.format(standard.name)
            validations = utils.load_csv(filename, False)
            standard.add_validations(validations)


def set_team_member_roles():
    for obj_name, display_name in STANDARD_OBJECTS:
        utils.set_team_member_roles(obj_name, ["CS", "渠道经理", "销售", "线上支持", "财务", "产品研发"])


def update_standards():
    standards = []
    for obj_name, display_name in STANDARD_OBJECTS:
        filename = FILEPATH_TEMPLETE.format(obj_name)
        meta_info = utils.load_csv(filename)
        standards.append(Standard(obj_name, display_name, meta_info))

    for standard in standards:
        standard.update_columns()


def delete_standards(args):
    standards = []
    for obj_name, display_name in STANDARD_OBJECTS:
        if obj_name != "User":
            filename = FILEPATH_TEMPLETE.format(obj_name)
            meta_info = utils.load_csv(filename)
            standards.append(Standard(obj_name, display_name, meta_info))
    if 'meta' in args:
        for standard in standards:
            standard.delete_columns()

        for standard in standards:
            utils.delete_meta(standard.name)

    if 'validation' in args:
        for standard in standards:
            if standard.name == 'User':
                continue
            filename = VALIDATIONS_FILEPATH_TEMPLETE.format(standard.name)
            validations = utils.load_csv(filename, False)
            standard.delete_validations(validations)


def get_standards():
    for obj_name, _ in STANDARD_OBJECTS:
        utils.get_meta(obj_name)


def get_validation(meta_name):
    url = EDIT_META_URL_TEMPLETE.format(meta_name) + "/validations"
    # print url
    try:
        res = utils.get(url, meta_name, 'get-validation')
    except Exception:
        print(u"连接异常...")
    else:
        json_file = json.dumps(res, ensure_ascii=False, indent=2)
        if json_file != "null":
            print(json_file)


def delete_standard_validation():
    print(u"请输入要清空validation的对象name")
    meta_name = raw_input()
    url = EDIT_META_URL_TEMPLETE.format(meta_name) + "/validations"
    try:
        res = utils.get(url, meta_name, 'get-validation')
        for key in res.keys():
            if key:
                from utils import delete_validation
                delete_validation(meta_name,key)
    except Exception:
        print(u"连接异常...")


def get_all_validation():
    standard_list = get_all_standard()
    for standard in standard_list:
        print standard
        get_validation(standard)
        print("-" * 100)


def delete_one_standard():
    '''
    删除一个标准对象
    '''
    print(u"请输入要删除对象的name")
    name = raw_input()
    utils.delete_meta(name)


def main():
    parser = argparse.ArgumentParser(
        description='Create/Delete standard objects.')
    subs = parser.add_subparsers(
        title='commands', dest='command', help='supported commands')

    create_parser = subs.add_parser(
        'create', help='create all standard objects')
    create_parser = subs.add_parser(
        'validation', help='create or update all validations')
    delete_parser = subs.add_parser(
        'delete', help='delete all standard objects')

    delete_validation = subs.add_parser(
        'delete_validation', help='delete validation')
    delete_one = subs.add_parser(
        'delete_one', help='delete_one_standard')
    create_validation = subs.add_parser(
        'create_validation', help='create_validation')
    getall_parser = subs.add_parser('getall', help='get all standard objects')
    update_parser = subs.add_parser('update', help='get all standard objects')
    roles_parser = subs.add_parser(
        'roles', help='set all standard objects team-member-roles')

    get_parser = subs.add_parser('get', help='get specified standard object')
    get_parser.add_argument('object', help='object name')

    args = parser.parse_args()

    if args.command == 'create':
        create_standards(['meta', 'validation'])
    elif args.command == 'delete':
        delete_standards(['meta', 'validation'])
    elif args.command == 'validation':
        delete_standards(['validation'])
        create_standards(['validation'])

    elif args.command == 'delete_validation':
        delete_standards(['validation'])
    elif args.command == 'create_validation':
        create_standards(['validation'])

    elif args.command == 'get':
        utils.get_meta(args.object)
    elif args.command == 'getall':
        get_standards()
    elif args.command == 'update':
        update_standards()
    elif args.command == 'roles':
        set_team_member_roles()
    elif args.command == 'delete_one':
        delete_one_standard()


if __name__ == '__main__':
    main()
