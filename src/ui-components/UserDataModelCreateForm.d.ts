/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type UserDataModelCreateFormInputValues = {
    username?: string;
    streak?: number;
    level?: number;
    HasOnboarded?: boolean;
};
export declare type UserDataModelCreateFormValidationValues = {
    username?: ValidationFunction<string>;
    streak?: ValidationFunction<number>;
    level?: ValidationFunction<number>;
    HasOnboarded?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserDataModelCreateFormOverridesProps = {
    UserDataModelCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
    streak?: PrimitiveOverrideProps<TextFieldProps>;
    level?: PrimitiveOverrideProps<TextFieldProps>;
    HasOnboarded?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type UserDataModelCreateFormProps = React.PropsWithChildren<{
    overrides?: UserDataModelCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserDataModelCreateFormInputValues) => UserDataModelCreateFormInputValues;
    onSuccess?: (fields: UserDataModelCreateFormInputValues) => void;
    onError?: (fields: UserDataModelCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserDataModelCreateFormInputValues) => UserDataModelCreateFormInputValues;
    onValidate?: UserDataModelCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserDataModelCreateForm(props: UserDataModelCreateFormProps): React.ReactElement;
