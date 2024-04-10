import { DataSource, EntityMetadata, EntityTarget } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';


/**
 * Retrieves the Typeorm column metadata for a given property from the Typeorm entity metadata.
 *
 * @param metadata - The entity metadata to search in.
 * @param property - The property to find the column metadata for.
 * @returns The column metadata for the given property.
 * @throws {Error} If no metadata is found for the given property.
 */
export function getColumnMetadataFromEntityMetadata<T>(metadata: EntityMetadata, property: keyof T): ColumnMetadata {
  const columnMetadata = metadata.findColumnWithPropertyName(property as string);

  if (!columnMetadata) {
    throw new Error(`No metadata found for property ${property as string}`);
  }

  return columnMetadata;
}

/**
 * Retrieves the Typeorm metadata for a specific column in an entity from a given data source.
 *
 * @param source - The data source from which to retrieve the metadata.
 * @param entity - The entity type or target for which to retrieve the metadata.
 * @param property - The property of the entity for which to retrieve the metadata.
 *
 * @returns The metadata for the specified column.
 */
export function getColumnMetadata<T>(source: DataSource, entity: ObjectType<T> | EntityTarget<T>, property: keyof T): ColumnMetadata {
  return getColumnMetadataFromEntityMetadata(source.getMetadata(entity), property);
}

/**
 * Retrieves the column name in the database for the given entity property.
 *
 * @param source - The data source to retrieve the column metadata from.
 * @param entity - The entity type or target that contains the property.
 * @param property - The property name of the entity.
 * @returns The column name in the database for the specified property.
 */
export function getColumnName<T>(source: DataSource, entity: ObjectType<T> | EntityTarget<T>, property: keyof T): string {
  const metadata = getColumnMetadata(source, entity, property);
  return metadata.databaseName;
}

/**
 * Returns an accessor function that retrieves the column names
 * for a specific property in the given entity from the given data source.
 *
 * @param source - The data source to get the column names from.
 * @param entity - The entity type or target that the column belongs to.
 * @return An accessor function that takes a property name and returns the corresponding column name.
 */
export function getColumnNamesAccessor<T>(source: DataSource, entity: ObjectType<T> | EntityTarget<T>): (property: keyof T) => string {
  return (property: keyof T) => getColumnName(source, entity, property);
}

/**
 * Extracts the database column name from Typeorm entity metadata.
 * @param metadata - The metadata object containing information about the entity.
 * @param property - the key of property defined in entity.
 *
 * @returns The column name in the database for the specified property.
 */
export function getColumnNameFromEntityMetadata<T>(metadata: EntityMetadata, property: keyof T): string {
  const columnMetadata = getColumnMetadataFromEntityMetadata(metadata, property);
  return columnMetadata.databaseName;
}

/**
 * Returns a function that can be used to access the column names from the given `EntityMetadata`
 * using the key of a property.
 *
 * @param metadata - The metadata object containing information about the entity.
 * @returns A function that returns the column name corresponding to the provided property key.
 */
export function getColumnNamesAccessorFromEntityMetadata<T>(metadata: EntityMetadata): (property: keyof T) => string {
  return (property: keyof T) => getColumnNameFromEntityMetadata(metadata, property);
}
