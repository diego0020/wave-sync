
let previousItem = '';

/**
 * Return random item from the given list
 */
export const randomItem = (list: any[]): any => {
  const idx = Math.floor(Math.random() * list.length);
  const item = list[idx];

  if (previousItem === item) {
    return randomItem(list);
  }

  previousItem = item;
  return item;
};
