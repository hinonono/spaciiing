export interface CustomVariableCode {
  name: string;
}

export interface CustomVariableCodeColor extends CustomVariableCode {
  value: string;
  opacity: number;
}

export interface CustomVariableCodeNumber extends CustomVariableCode {
  value: number;
}

export interface CustomVariableCodeString extends CustomVariableCode {
  value: string;
}

export interface CustomVariableCodeBool extends CustomVariableCode {
  value: boolean;
}
