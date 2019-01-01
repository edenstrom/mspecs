import { capitalize } from '../utils/capitalize';
import { singular } from 'pluralize';

export const getClassName = (name?: string, mspecs: boolean = true) => {
  let className = capitalize(name);

  if (mspecs) {
    className = `Mspecs${className}`;
  }

  const regex = /sms$/i;

  if (regex.test(className)) {
    return className;
  }

  return singular(className);
};

export const getCollectionName = (className: string) =>
  `${className}CollectionTypes`;
