import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import {validatePath, validateType} from "../utils";

export function IsValidLinkPath(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidLinkPath",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          try {
            validatePath(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return "Path must consist of valid qualifier/identifier pairs separated by forward slashes";
        },
      },
    });
  };
}

export function IsValidLinkType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidLinkType",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          try {
            validateType(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return "Type must be a valid MIME type format (type/subtype)";
        },
      },
    });
  };
}
