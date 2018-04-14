export interface Rule {
  name: string;
  lint($: CheerioStatic): LintResult;
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
