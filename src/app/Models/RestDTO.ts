import { LinkDTO } from './LinkDTO';

export interface RestDTO<T> {
  data: T;
  links?: LinkDTO[];
}