import { ModelInit, MutableModel, __modelMeta__, CustomIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerEmotionStats = {
  readonly Happy?: number | null;
  readonly Sad?: number | null;
  readonly Angry?: number | null;
  readonly Fear?: number | null;
  readonly Disgust?: number | null;
  readonly Surprise?: number | null;
}

type LazyEmotionStats = {
  readonly Happy?: number | null;
  readonly Sad?: number | null;
  readonly Angry?: number | null;
  readonly Fear?: number | null;
  readonly Disgust?: number | null;
  readonly Surprise?: number | null;
}

export declare type EmotionStats = LazyLoading extends LazyLoadingDisabled ? EagerEmotionStats : LazyEmotionStats

export declare const EmotionStats: (new (init: ModelInit<EmotionStats>) => EmotionStats)

type EagerBadgeList = {
  readonly BadgeQuestion50?: boolean | null;
  readonly BadgeQuestion100?: boolean | null;
  readonly BadgeQuestion200?: boolean | null;
  readonly BadgeDayHalf?: boolean | null;
  readonly BadgeDayMonth?: boolean | null;
  readonly BadgeDayThreeMonths?: boolean | null;
  readonly BadgeHappy40?: boolean | null;
  readonly BadgeSad40?: boolean | null;
  readonly BadgeFear40?: boolean | null;
  readonly BadgeDisgust40?: boolean | null;
  readonly BadgeSurprise40?: boolean | null;
  readonly BadgeAngry40?: boolean | null;
  readonly BadgeHappy60?: boolean | null;
  readonly BadgeSad60?: boolean | null;
  readonly BadgeFear60?: boolean | null;
  readonly BadgeDisgust60?: boolean | null;
  readonly BadgeSurprise60?: boolean | null;
  readonly BadgeAngry60?: boolean | null;
}

type LazyBadgeList = {
  readonly BadgeQuestion50?: boolean | null;
  readonly BadgeQuestion100?: boolean | null;
  readonly BadgeQuestion200?: boolean | null;
  readonly BadgeDayHalf?: boolean | null;
  readonly BadgeDayMonth?: boolean | null;
  readonly BadgeDayThreeMonths?: boolean | null;
  readonly BadgeHappy40?: boolean | null;
  readonly BadgeSad40?: boolean | null;
  readonly BadgeFear40?: boolean | null;
  readonly BadgeDisgust40?: boolean | null;
  readonly BadgeSurprise40?: boolean | null;
  readonly BadgeAngry40?: boolean | null;
  readonly BadgeHappy60?: boolean | null;
  readonly BadgeSad60?: boolean | null;
  readonly BadgeFear60?: boolean | null;
  readonly BadgeDisgust60?: boolean | null;
  readonly BadgeSurprise60?: boolean | null;
  readonly BadgeAngry60?: boolean | null;
}

export declare type BadgeList = LazyLoading extends LazyLoadingDisabled ? EagerBadgeList : LazyBadgeList

export declare const BadgeList: (new (init: ModelInit<BadgeList>) => BadgeList)

type EagerUserDataModel = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<UserDataModel, 'username'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly username: string;
  readonly streak?: number | null;
  readonly level?: number | null;
  readonly badges?: BadgeList | null;
  readonly SpeakingQuestions?: EmotionStats | null;
  readonly ListeningQuestions?: EmotionStats | null;
  readonly CoversationQuestions?: EmotionStats | null;
  readonly HasOnboarded?: boolean | null;
  readonly SpeakingAccuracy?: EmotionStats | null;
  readonly ListeningAccuracy?: EmotionStats | null;
  readonly ConversationAccuracy?: EmotionStats | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserDataModel = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<UserDataModel, 'username'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly username: string;
  readonly streak?: number | null;
  readonly level?: number | null;
  readonly badges?: BadgeList | null;
  readonly SpeakingQuestions?: EmotionStats | null;
  readonly ListeningQuestions?: EmotionStats | null;
  readonly CoversationQuestions?: EmotionStats | null;
  readonly HasOnboarded?: boolean | null;
  readonly SpeakingAccuracy?: EmotionStats | null;
  readonly ListeningAccuracy?: EmotionStats | null;
  readonly ConversationAccuracy?: EmotionStats | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserDataModel = LazyLoading extends LazyLoadingDisabled ? EagerUserDataModel : LazyUserDataModel

export declare const UserDataModel: (new (init: ModelInit<UserDataModel>) => UserDataModel) & {
  copyOf(source: UserDataModel, mutator: (draft: MutableModel<UserDataModel>) => MutableModel<UserDataModel> | void): UserDataModel;
}