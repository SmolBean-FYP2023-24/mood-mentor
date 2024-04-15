/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { UserDataModel } from "../models";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserDataModelUpdateFormInputValues = {
    username?: string;
    streak?: number;
    level?: number;
    HasOnboarded?: boolean;
};
export declare type UserDataModelUpdateFormValidationValues = {
    username?: ValidationFunction<string>;
    streak?: ValidationFunction<number>;
    level?: ValidationFunction<number>;
    HasOnboarded?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserDataModelUpdateFormOverridesProps = {
    UserDataModelUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
    streak?: PrimitiveOverrideProps<TextFieldProps>;
    level?: PrimitiveOverrideProps<TextFieldProps>;
    HasOnboarded?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type UserDataModelUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserDataModelUpdateFormOverridesProps | undefined | null;
} & {
    username?: string;
    userDataModel?: UserDataModel;
    onSubmit?: (fields: UserDataModelUpdateFormInputValues) => UserDataModelUpdateFormInputValues;
    onSuccess?: (fields: UserDataModelUpdateFormInputValues) => void;
    onError?: (fields: UserDataModelUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserDataModelUpdateFormInputValues) => UserDataModelUpdateFormInputValues;
    onValidate?: UserDataModelUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserDataModelUpdateForm(props: UserDataModelUpdateFormProps): React.ReactElement;
