export type StoredAdmin = {
  id: number;
  name: string;
  email: string;
};

export type FetchCurrentAdminResult =
  | { ok: true; admin: StoredAdmin }
  | { ok: false; unauthorized?: boolean };

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export type LoginSuccess = { ok: true };
export type LoginFailure = { ok: false; message: string };
export type LoginResult = LoginSuccess | LoginFailure;
