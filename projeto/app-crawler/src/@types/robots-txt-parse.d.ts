declare module 'robots-txt-parse' {
    interface Rule {
        rule: 'allow' | 'disallow' | 'noindex';
        path: string;
    }
  
    interface Group {
        agents: string[];
        rules: Rule[];
    }
  
    interface Extension {
        extension: string;
        value: string;
    }
  
    interface RobotsTxtParsed {
        groups: Group[];
        extensions?: Extension[];
    }
  
    // Retorna um objeto que é compatível com RobotsTxtConfig
    export default function parse(input: string): Promise<RobotsTxtParsed>;
  }
  