export interface Rule {
  name: string;
  lint($: CheerioStatic): LintResult;
}

export interface LintResult {
  errors: LintError[];
}

export interface LintError {
  message: string;
}
