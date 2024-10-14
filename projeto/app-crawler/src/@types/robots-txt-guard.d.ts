declare module 'robots-txt-guard' {
    interface Rule {
        rule: 'allow' | 'disallow' | 'noindex';
        path: string;
    }
  
    interface Group {
        agents: string[];
        rules: Rule[];
    }
  
    interface RobotsTxtConfig {
        groups: Group[];
    }
  
    interface RobotsTxt {
        isAllowed(agent: string, path: string): boolean;
        isIndexable(agent: string, path: string): boolean;
    }
  
    export default function guard(config: RobotsTxtConfig): RobotsTxt;
}
  