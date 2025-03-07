/*
 * @param args (Takes in any number of objects and merges them)
 * @returns (An Object with merged key fields of the arguments object)
 * In case of common keys, the latter one takes preference
 */
export function merge(...args: Record<any, any>[]): Record<any, any> {
  const result: Record<string, any> = {};
  args.forEach((obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
  });
  return result;
}
