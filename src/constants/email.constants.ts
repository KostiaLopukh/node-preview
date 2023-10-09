export enum EEmailActions {
  WELCOME,
  FORGOT_PASSWORD,
}

export const allTemplates = {
  [EEmailActions.WELCOME]: {
    templateName: "register",
    subject: "Welcome to our significant app",
  },
  [EEmailActions.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Do not worry, your password is under control",
  },
};
