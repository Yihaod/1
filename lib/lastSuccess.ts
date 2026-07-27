/** 提交成功后备用，防止 Web 路由参数丢失 */
let pendingSuccessId: string | null = null;

export function setPendingSuccessBookingId(id: string): void {
  pendingSuccessId = id;
}

export function takePendingSuccessBookingId(): string | null {
  const id = pendingSuccessId;
  pendingSuccessId = null;
  return id;
}

export function peekPendingSuccessBookingId(): string | null {
  return pendingSuccessId;
}
