import { SetMetadata } from '@nestjs/common';

export const RECRUITING_AGGREGATOR_SOURCE_METADATA = Symbol('recruiting-aggregator-source');

export const RecruitingAggregatorSource = () => SetMetadata(RECRUITING_AGGREGATOR_SOURCE_METADATA, true);
