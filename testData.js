// eslint-disable-next-line import/no-extraneous-dependencies
import { stripIndents } from 'common-tags';

export const EMAIL = 'foo@bar.baz';
export const EMPTY_ARRAY = [];
export const ERROR = 'foo';
export const ERROR_MSG = 'Set sail for fail!';
export const FOUND = 'bar';
export const MESSAGE = 'Wubba lubba dub dub!';
export const SUFFIXES = stripIndents`
  6FE2CC53D504BD0A9D08F20A14947810AFA:5
  7020FF920E5AA642C3D4066950DD1F01F4D:9694
  70B1F5529AF62180147F6AAFECFFFCE8AAC:2
`; // snippet of suffixes for hashed version of 'bar'
export const NOT_FOUND = 'baz';
export const NONE = ' ';
export const OBJ = { foo: 'bar ' };
export const OBJ_ARRAY = [OBJ];
