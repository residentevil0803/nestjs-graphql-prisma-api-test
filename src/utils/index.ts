export { featureName } from './feature-name';
export { createConfig } from './create-config';

import { ObjectLiteralExpression, PropertyAssignment, StructureKind } from 'ts-morph';

import { PrismaDMMF } from '../types';
export { generateFileName } from './generate-file-name';

type ToGraphqlImportTypeArgs = {
    isId: boolean;
    type: string;
    kind: string;
};

export function toGraphqlImportType(args: ToGraphqlImportTypeArgs) {
    const { isId, type, kind } = args;
    let name = type;
    if (isId) {
        return { name: 'ID', moduleSpecifier: '@nestjs/graphql' };
    }
    if (['Int', 'Float'].includes(name)) {
        return { name, moduleSpecifier: '@nestjs/graphql' };
    }
    if (kind === 'scalar' && type === 'Json') {
        return { name: 'GraphQLJSON', moduleSpecifier: 'graphql-type-json' };
    }
    if (['DateTime', 'Decimal', 'BigInt', 'Bytes'].includes(name)) {
        return { name: 'String', moduleSpecifier: undefined };
    }
    if (name === 'true') {
        name = 'Boolean';
    }
    return { name, moduleSpecifier: undefined };
}

const patterns = new Map([
    [{ type: (type: string) => type === 'String', kind: 'scalar' }, () => 'string'],
    [{ type: (type: string) => type === 'DateTime', kind: 'scalar' }, () => 'Date | string'],
    [{ type: (type: string) => type === 'Float', kind: 'scalar' }, () => 'number'],
    [{ type: (type: string) => type === 'Int', kind: 'scalar' }, () => 'number'],
    [{ type: (type: string) => type === 'Boolean', kind: 'scalar' }, () => 'boolean'],
    [{ type: (type: string) => type === 'Json', kind: 'scalar' }, () => 'object'],
    [{ type: (type: string) => type === 'Null', kind: 'scalar' }, () => 'null'],
    [{ type: (type: string) => type === 'Decimal', kind: 'scalar' }, () => 'string'],
    [{ type: (type: string) => type === 'Bytes', kind: 'scalar' }, () => 'Buffer'],
    [{ type: (type: string) => type === 'BigInt', kind: 'scalar' }, () => 'BigInt'],
    [{ type: () => true, kind: 'object' }, (field: { type: string }) => field.type],
    [{ type: () => true, kind: 'enum' }, (field: { type: string }) => field.type],
    [{ type: () => true, kind: 'scalar' }, (field: { type: string }) => field.type],
]);

type ToPropertyTypeArgs = {
    type: string;
    kind: string;
    isList: boolean;
};
/**
 * Returns typescript property type.
 */
export function toPropertyType(args: ToPropertyTypeArgs): string {
    const { type, kind, isList } = args;
    for (const [key, get] of patterns.entries()) {
        if (key.kind === kind && key.type(type)) {
            let result = get(args);
            if (isList) {
                result = `Array<${result}>`;
            }
            return result;
        }
    }
    // console.log('args', args);
    throw new TypeError(`Cannot get property type from ${args.kind}/${args.type}`);
}

/**
 * See client/src/generation/TSClient.ts @ getAggregationTypes
 */
export function schemaOutputToInput(outputType: PrismaDMMF.OutputType): PrismaDMMF.InputType {
    return {
        name: outputType.name.replace(/OutputType$/, 'Input'),
        constraints: {
            // eslint-disable-next-line unicorn/no-null
            maxNumFields: null,
            // eslint-disable-next-line unicorn/no-null
            minNumFields: null,
        },
        fields: outputType.fields.map((field) => {
            return {
                ...field,
                isNullable: false,
                isRequired: false,
                name: field.name,
                inputTypes: [
                    {
                        isList: false,
                        kind: 'scalar',
                        type: 'true',
                    },
                ],
            };
        }),
    };
}

export function schemaFieldToArgument(field: PrismaDMMF.SchemaField): PrismaDMMF.InputType {
    let name = field.name;
    name = name[0].toUpperCase() + name.slice(1) + 'Args';
    return {
        name,
        fields: field.args,
        constraints: {
            // eslint-disable-next-line unicorn/no-null
            maxNumFields: null,
            // eslint-disable-next-line unicorn/no-null
            minNumFields: null,
        },
    };
}

export function getOutputTypeName(name: string) {
    return name.replace(/OutputType$/, '');
}

type UpdateObjectPropertyArgs = {
    expression: ObjectLiteralExpression;
    name: string;
    value: string | number | boolean | undefined;
    defaultValue?: string | number | boolean;
};

export function updateObjectProperty(args: UpdateObjectPropertyArgs) {
    const { expression, name, value, defaultValue } = args;
    let descriptionProperty = expression.getProperty(name) as PropertyAssignment | undefined;

    if (!descriptionProperty) {
        descriptionProperty = expression.addProperty({
            name,
            kind: StructureKind.PropertyAssignment,
            initializer: defaultValue !== undefined ? String(defaultValue) : 'undefined',
        }) as PropertyAssignment;
    }
    descriptionProperty.set({
        initializer:
            JSON.stringify(value) ||
            (defaultValue !== undefined ? String(defaultValue) : 'undefined'),
    });
}
