import {OptionItem} from './OptionItem';

export interface SelectNode {
  option: OptionItem;
  childrenNodes: SelectNode[];
  expanded?: boolean;
}
