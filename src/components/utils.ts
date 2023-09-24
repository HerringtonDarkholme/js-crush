export function* chunkTwo<T>(array: T[]) {
  for (let i = 0; i < array.length - 1; i++) {
    yield [array[i], array[i + 1]]
  }
}

// 生成日期
export function getNowFormatDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
}

