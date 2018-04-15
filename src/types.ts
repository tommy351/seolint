export interface Rule {
  schema?: object;
  lint($: CheerioStatic, options?: any): LintResult;
}

export interface LintResult {
  errors: LintError[];
}

export interface LintError {
  message: string;
  name?: string;
  element?: CheerioElement;
  location?: Location;
}

export interface Location {
  line: number;
  col: number;
  startOffset: number;
  endOffset: number;
}
