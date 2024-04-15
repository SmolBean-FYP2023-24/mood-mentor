/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserDataModel = /* GraphQL */ `
  query GetUserDataModel($username: String!) {
    getUserDataModel(username: $username) {
      username
      streak
      level
      badges {
        BadgeQuestion50
        BadgeQuestion100
        BadgeQuestion200
        BadgeDayHalf
        BadgeDayMonth
        BadgeDayThreeMonths
        BadgeHappy40
        BadgeSad40
        BadgeFear40
        BadgeDisgust40
        BadgeSurprise40
        BadgeAngry40
        BadgeHappy60
        BadgeSad60
        BadgeFear60
        BadgeDisgust60
        BadgeSurprise60
        BadgeAngry60
        __typename
      }
      SpeakingQuestions {
        Happy
        Sad
        Angry
        Fear
        Disgust
        Surprise
        __typename
      }
      ListeningQuestions {
        Happy
        Sad
        Angry
        Fear
        Disgust
        Surprise
        __typename
      }
      CoversationQuestions {
        Happy
        Sad
        Angry
        Fear
        Disgust
        Surprise
        __typename
      }
      HasOnboarded
      SpeakingAccuracy {
        Happy
        Sad
        Angry
        Fear
        Disgust
        Surprise
        __typename
      }
      ListeningAccuracy {
        Happy
        Sad
        Angry
        Fear
        Disgust
        Surprise
        __typename
      }
      ConversationAccuracy {
        Happy
        Sad
        Angry
        Fear
        Disgust
        Surprise
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listUserDataModels = /* GraphQL */ `
  query ListUserDataModels(
    $username: String
    $filter: ModelUserDataModelFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserDataModels(
      username: $username
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        username
        streak
        level
        HasOnboarded
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUserDataModels = /* GraphQL */ `
  query SyncUserDataModels(
    $filter: ModelUserDataModelFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserDataModels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        username
        streak
        level
        HasOnboarded
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
