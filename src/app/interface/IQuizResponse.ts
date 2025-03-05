import { IQuestion } from "./IQuestion";

export interface IQuizResponse {
    reponse_code: number,
    results: IQuestion[]
}