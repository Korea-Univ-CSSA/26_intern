const testDataA = {
  JavaScript: 420,
  TypeScript: 310,
  Python: 520,
  Java: 260,
  CSharp: 190,
  Go: 140,
  Rust: 95,
  Cpp: 110,
  C: 80,
  PHP: 160,
  Ruby: 75,
  Swift: 130,
  Kotlin: 125,
  Dart: 90,
  Scala: 60,
  R: 55,
  MATLAB: 45,
  Shell: 70,
  PowerShell: 65,
  Groovy: 40,
  ObjectiveC: 35,
  Haskell: 30,

  // ADD 1
  Lua: 85,
  Perl: 50,
  Julia: 48,
  Elixir: 58,
  Erlang: 42,
  FSharp: 38,
  OCaml: 32,
  Nim: 28,
  Zig: 26,
  Crystal: 24,
  Hack: 22,
  Apex: 20,
  COBOL: 18,
  Fortran: 16,
  Assembly: 14,
  Solidity: 68,
  VHDL: 12,
  Verilog: 11,
  WebAssembly: 34,
  Scratch: 10,

  // ADD 2
  SQL: 300,
  NoSQL: 210,
  GraphQL: 155,
  Bash: 95,
  HCL: 44,
  Terraform: 52,
  Ansible: 48,
  Puppet: 36,
  Chef: 33,
  Makefile: 29,
  YAML: 170,
  JSON: 180,
  TOML: 27,

  // ADD 3
  HTML: 450,
  CSS: 430,
  SASS: 140,
  LESS: 75,
  PostCSS: 60,
  JSX: 260,
  TSX: 240,
  WebGL: 50,
  GLSL: 22,
};

const testDataB = {
  Unknown: 123,
  Low: 456,
  Medium: 789,
  High: 321,
  Critical: 111,
};

// Year Based
const testDataC = {
  "name": "main",
  "children": [
    {
      "name": "2016",
      "color": "#4E79A7",
      "children": [
        {
          "name": "Critical",
          "color": "#c842f5",
          "children": [
            { "name": "CWE-79", "color": "#264653", "size": 1 },
            { "name": "CWE-89", "color": "#264653", "size": 1 }
          ]
        },
        {
          "name": "High",
          "color": "#D62728",
          "children": [
            { "name": "CWE-22", "color": "#264653", "size": 1 }
          ]
        },
        {
          "name": "Medium",
          "color": "#FF7F0E",
          "children": [
            { "name": "CWE-20", "color": "#264653", "size": 1 },
            { "name": "CWE-200", "color": "#264653", "size": 1 }
          ]
        }
      ]
    },
    {
      "name": "2017",
      "color": "#59A14F",
      "children": [
        {
          "name": "High",
          "color": "#D62728",
          "children": [
            { "name": "CWE-352", "color": "#6D597A", "size": 1 },
            { "name": "CWE-287", "color": "#6D597A", "size": 1 }
          ]
        },
        {
          "name": "Medium",
          "color": "#FF7F0E",
          "children": [
            { "name": "CWE-119", "color": "#6D597A", "size": 1 }
          ]
        }
      ]
    },
    {
      "name": "2018",
      "color": "#EDC948",
      "children": [
        {
          "name": "Critical",
          "color": "#c842f5",
          "children": [
            { "name": "CWE-94", "color": "#8D99AE", "size": 1 }
          ]
        },
        {
          "name": "Low",
          "color": "#2CA02C",
          "children": [
            { "name": "CWE-310", "color": "#8D99AE", "size": 1 }
          ]
        },
        {
          "name": "Medium",
          "color": "#FF7F0E",
          "children": [
            { "name": "CWE-416", "color": "#8D99AE", "size": 1 },
            { "name": "CWE-125", "color": "#8D99AE", "size": 1 }
          ]
        }
      ]
    },
    {
      "name": "2019",
      "color": "#b2ca38",
      "children": [
        {
          "name": "High",
          "color": "#D62728",
          "children": [
            { "name": "CWE-400", "color": "#7D4F50", "size": 1 }
          ]
        },
        {
          "name": "Medium",
          "color": "#FF7F0E",
          "children": [
            { "name": "CWE-78", "color": "#7D4F50", "size": 1 },
            { "name": "CWE-755", "color": "#7D4F50", "size": 1 },
            { "name": "CWE-327", "color": "#7D4F50", "size": 1 }
          ]
        }
      ]
    },
    {
      "name": "2020",
      "color": "#9C755F",
      "children": [
        {
          "name": "Critical",
          "color": "#c842f5",
          "children": [
            { "name": "CWE-502", "color": "#2A9D8F", "size": 1 }
          ]
        },
        {
          "name": "High",
          "color": "#D62728",
          "children": [
            { "name": "CWE-611", "color": "#2A9D8F", "size": 1 }
          ]
        },
        {
          "name": "Medium",
          "color": "#FF7F0E",
          "children": [
            { "name": "CWE-787", "color": "#2A9D8F", "size": 1 },
            { "name": "CWE-918", "color": "#2A9D8F", "size": 1 }
          ]
        },
        {
          "name": "Low",
          "color": "#2CA02C",
          "children": [
            { "name": "CWE-209", "color": "#2A9D8F", "size": 1 }
          ]
        }
      ]
    }
  ]
}

// CVSS Based
const testDataD = {
  name: "main",
  children: [
    {
      name: "Critical",
      color: "#c842f5",
      children: [
        {
          name: "2016",
          color: "#7ad151",
          children: [
            { name: "CWE-79", color: "#9be36f", size: 1 },
            { name: "CWE-89", color: "#9be36f", size: 1 },
          ],
        },
        {
          name: "2018",
          color: "#21918c",
          children: [
            { name: "CWE-94", color: "#35b0aa", size: 1 }
          ],
        },
        {
          name: "2020",
          color: "#443983",
          children: [
            { name: "CWE-502", color: "#5c4fa3", size: 1 }
          ],
        },
      ],
    },

    {
      name: "High",
      color: "#D62728",
      children: [
        {
          name: "2016",
          color: "#7ad151",
          children: [
            { name: "CWE-22", color: "#9be36f", size: 1 }
          ],
        },
        {
          name: "2017",
          color: "#35b779",
          children: [
            { name: "CWE-352", color: "#4fd894", size: 1 },
            { name: "CWE-287", color: "#4fd894", size: 1 },
          ],
        },
        {
          name: "2019",
          color: "#31688e",
          children: [
            { name: "CWE-400", color: "#4a84ad", size: 1 }
          ],
        },
        {
          name: "2020",
          color: "#443983",
          children: [
            { name: "CWE-611", color: "#5c4fa3", size: 1 }
          ],
        },
      ],
    },

    {
      name: "Medium",
      color: "#FF7F0E",
      children: [
        {
          name: "2016",
          color: "#7ad151",
          children: [
            { name: "CWE-20", color: "#9be36f", size: 1 },
            { name: "CWE-200", color: "#9be36f", size: 1 },
          ],
        },
        {
          name: "2017",
          color: "#35b779",
          children: [
            { name: "CWE-119", color: "#4fd894", size: 1 }
          ],
        },
        {
          name: "2018",
          color: "#21918c",
          children: [
            { name: "CWE-416", color: "#35b0aa", size: 1 },
            { name: "CWE-125", color: "#35b0aa", size: 1 },
          ],
        },
        {
          name: "2019",
          color: "#31688e",
          children: [
            { name: "CWE-78", color: "#4a84ad", size: 1 },
            { name: "CWE-755", color: "#4a84ad", size: 1 },
            { name: "CWE-327", color: "#4a84ad", size: 1 },
          ],
        },
        {
          name: "2020",
          color: "#443983",
          children: [
            { name: "CWE-787", color: "#5c4fa3", size: 1 },
            { name: "CWE-918", color: "#5c4fa3", size: 1 },
          ],
        },
      ],
    },

    {
      name: "Low",
      color: "#2CA02C",
      children: [
        {
          name: "2018",
          color: "#21918c",
          children: [
            { name: "CWE-310", color: "#35b0aa", size: 1 }
          ],
        },
        {
          name: "2020",
          color: "#443983",
          children: [
            { name: "CWE-209", color: "#5c4fa3", size: 1 }
          ],
        },
      ],
    },
  ],
};

const DATASETS = {
  language: testDataA,
  cvss: testDataB,
  sunburst: testDataD,
};

export default DATASETS;
