export const random = {
  number(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  choice<T>(items: T[]) {
    return items[random.number(0, items.length - 1)];
  },
};
