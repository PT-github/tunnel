/*
 * @Author: PT
 * @Date: 2021-09-26 21:31:06
 * @LastEditors: PT
 * @LastEditTime: 2021-09-26 21:31:07
 * @Description: file content
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
