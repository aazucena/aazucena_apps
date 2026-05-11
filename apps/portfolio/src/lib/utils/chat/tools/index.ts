import { setEmotionTool } from "./set-emotion";
import { createSubmitContactFormTool } from "./submit-contact-form";

export function createChatTools(pathname: string) {
  return {
    set_emotion: setEmotionTool,
    submit_contact_form: createSubmitContactFormTool(pathname),
  };
}
