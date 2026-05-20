/**
 * action 관련 type
 * TODO: type 위치를 좀 더 고민해봐도 좋을 것 같다.
 */

export type ActionState<T> = {
  success: boolean;
  message: string;
  error?: Record<string, string[]>;
  data?: T;
};
