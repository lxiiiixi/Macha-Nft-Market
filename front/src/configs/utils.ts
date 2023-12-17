export function shortAddress(address: string) {
    return `${address.slice(0, 5)}...${address.slice(-6)}`;
}

export function timestampToDate(timestampBigInt: bigint) {
    const timestamp = Number(timestampBigInt);
    const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
}
