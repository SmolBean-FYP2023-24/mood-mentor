// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserDataModel, EmotionStats, BadgeList } = initSchema(schema);

export {
  UserDataModel,
  EmotionStats,
  BadgeList
};