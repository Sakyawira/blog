---
title: 'From AI Coding to Accountable Engineering'
description: 'Ideas from Agentic Engineering Day NZ on engineering judgment, agent security, evaluations, software factories, and the research behind them.'
pubDate: 2026-10-29
updatedDate: 2026-10-29
tags:
  - software-engineering
  - ai
  - agentic-engineering
readingTime: '13 min read'
draft: false
---

## Executive summary

The report covers eight conference themes and related research on **software engineering work, reliability, security and accountability**.

1. **Engineering roles:** Vella describes supervisory engineering work; Curlewis compares agent coordination with technical leadership.
2. **Delivery and productivity:** Shoup discusses integration bottlenecks; the cited experiments report different productivity outcomes in different settings.
3. **Modularity:** Shoup discusses component boundaries, while Mohtasebi and Wang describe architecture decision records and drift detection.
4. **Guidance and authorization:** Pandya distinguishes repository instructions from runtime permission checks.
5. **Observability:** Brown describes tracing model and tool interactions; Microsoft and OpenTelemetry document the relevant instrumentation.
6. **Evaluation:** Madanlal describes evaluation-driven development; Zheng and colleagues report biases in LLM judging.
7. **External interactions:** Lakshminarayanan proposes identity, inbox, wallet, tools, memory and audit as components of agent-ready business systems.
8. **Software factories:** Costa presents Autohand workflows; Wulf describes Nano BPM, software gardening and his team's reported output.

A separate section covers **Mic Neale’s Mesh LLM and shared-compute inference**.

## Where these ideas come from

The starting point is **Agentic Engineering Day NZ**, held at the **Aotea Centre in Auckland on 22 October 2026**. The conference brought together engineers, architects and practitioners working on AI-assisted software delivery and production agents. The [official programme](https://www.agenticengineering.day/) provides the speaker names, affiliations and session titles used here. [1](#ref-1)

### Speakers and their topics

| Speakers                                                                                     | Organisation                                      | Topic                                                                                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [Annie Vella](https://annievella.com/posts/supervisory-engineering-work/)                    | Engineering leader and researcher; Inference Labs | _The Accidental Rise of the Supervisory Engineer_ — how AI changes engineering work, accountability and human control                    |
| [Randy Shoup](https://www.agenticengineering.day/speakers/randy-shoup)                       | CircleCI                                          | _Back to Fundamentals: With Models Modularity Matters More_ — specifications, delivery flow and modular architecture                     |
| [Mic Neale](https://www.agenticengineering.day/speakers/mic-neale)                           | Block                                             | _What If You Never Needed an API Key Again? Building a Mesh LLM From Spare Compute_ — distributed inference and pooled compute           |
| [David Curlewis](https://www.agenticengineering.day/speakers/david-curlewis)                 | Canva                                             | _You're the Principal Engineer of an Agent Squad. Not a Manager._ — technical leadership, motivation and engineering judgment            |
| [Jerome Brown](https://www.agenticengineering.day/speakers/jerome-brown)                     | Mantel                                            | _Opening the Black Box: Tracking, Troubleshooting, and Auditing AI Agents in Production_ — tracing, telemetry and operational visibility |
| [Pauline Kelly and Everett Toews](https://www.agenticengineering.day/speakers/pauline-kelly) | AWS and Deloitte, respectively                    | _Securing the AI-DLC: Travel Edition_ — secure development foundations and controls across the development lifecycle                     |
| [Igor Costa](https://www.agenticengineering.day/speakers/igor-costa)                         | Autohand AI                                       | _Build your own AI Software Factory_ — coding agents, model choices and coordinated workflows                                            |
| [Jyothi Madanlal](https://www.agenticengineering.day/speakers/jyothi-madanlal)               | AWS                                               | _Eval Driven Development_ — measuring agent quality and improving it continuously                                                        |
| [Mal Curtis](https://www.agenticengineering.day/speakers/mal-curtis)                         | NVIDIA                                            | _Why LLMs Fall for Stories (And 5 Production Patterns That Actually Stop Them)_ — prompt injection and layered defences                  |
| [Josh Wulf](https://www.agenticengineering.day/speakers/josh-wulf)                           | Camunda                                           | _Software Factories: From Success to Scale_ — orchestration, organisational change and software gardening                                |
| [BMK Lakshminarayanan](https://www.agenticengineering.day/speakers/bmk-lakshminarayanan)     | SECTION6                                          | _Your Agent Isn't Broken. The Internet Is._ — preparing business systems for agents through identity, delegation and verifiable outcomes |
| [Darshit Pandya](https://www.agenticengineering.day/speakers/darshit-pandya)                 | Serko                                             | _Intent Is Not Policy: The Two-Layer Contract for Production Agents_ — separating repository guidance from runtime authorization         |
| [Amir Mohtasebi and Brian Wang](https://www.agenticengineering.day/speakers/amir-mohtasebi)  | Trade Me                                          | _Lightweight Architecture Governance in the Age of AI_ — architectural decisions, distributed advice and early detection of drift        |

### Research and supporting sources

The report groups conference notes into eight themes. Speaker proposals, project documentation and published research are identified separately. Supporting sources cover automation, developer productivity, evaluation and prompt injection. **OWASP, NIST, OpenTelemetry, Microsoft and AWS** provide security and implementation guidance. Publication types are labelled in the references; the closing governance discussion also draws on Mohtasebi and Wang's public session description.

## Eight themes

### 1. Changing engineering roles: supervision and technical leadership

**Speakers:** Annie Vella and David Curlewis.

Vella describes **supervisory engineering work** as directing AI, evaluating its output and correcting it when necessary. [2](#ref-2) Curlewis argues that coordinating agents is closer to technical leadership than people management: it does not involve the same relationships, career responsibilities or consequences for employees.

**Related research:** Vella and Kelly Blincoe's 2026 longitudinal preprint used two questionnaires six months apart: 158 eligible participants initially, 101 later, with a matched cohort of 95. Its abstract reports that 82% perceived spending less time writing code. Perceived productivity improvement remained at 84% across the two time points, while the proportion of matched participants reporting a worsening in at least one developer-experience dimension increased from 14% to 27%. These are self-reported experiences, not a causal measure of productivity. [3](#ref-3)

The older automation literature offers a related perspective. Bainbridge's _Ironies of Automation_ describes how automation can leave humans with rare, difficult intervention tasks while reducing practice in the skills needed to perform them. Endsley and Kiris experimentally connected increased automation with poorer situation awareness and slower manual decisions after automation failure, in a navigation task. That experiment studied navigation, not software development; it does not establish the size of any corresponding effect on coding. [4](#ref-4), [5](#ref-5)

### 2. Code generation, delivery bottlenecks and productivity

**Speaker:** Randy Shoup.

Shoup separates the **inner loop**—local implementation, testing and debugging—from the **outer loop**—integration, validation and production delivery. He argues that increasing the rate of code proposals can overload downstream stages unless the delivery system improves too.

**Related research:** Peng and colleagues reported that an AI-assisted group completed a specific JavaScript HTTP-server task 55.8% faster than a control group. In contrast, Becker and colleagues' 2025 randomized study of 16 experienced open-source developers completing 246 tasks in familiar, mature projects found that allowing early-2025 AI tools increased completion time by 19%. Both are cited here as preprints; their tasks, participants, tools and study periods differ. [7](#ref-7), [8](#ref-8)

### 3. Modularity and architecture

**Speakers:** Randy Shoup, Amir Mohtasebi and Brian Wang.

Shoup argues that modular boundaries become more valuable as code generation accelerates. He uses a payment system to illustrate a simple external interface hiding a complex implementation.

**Related research:** Parnas's classic _Communications of the ACM_ paper treats modularization as a way to improve flexibility and comprehensibility and potentially shorten development time. The benefit depends on how the system is divided, not simply on the number of modules. [6](#ref-6)

Mohtasebi and Wang describe Trade Me's distributed architectural participation, advice process, architecture decision records and guardrails. Their public session description also proposes using an agent to flag drift from recorded decisions. [24](#ref-24)

### 4. Repository guidance and runtime authorization

**Speakers:** Pauline Kelly, Everett Toews, Mal Curtis and Darshit Pandya.

**Repository instructions guide behaviour; runtime authorization determines what actions are permitted.** Pandya's presentation separates those responsibilities, and OWASP recommends enforcing least privilege outside the model. [23](#ref-23), [11](#ref-11)

Kelly and Toews place security throughout the development lifecycle. AWS's foundational AI-DLC description uses inception, construction and operations, with human validation across those phases. [15](#ref-15) NIST's SSDF community profile likewise describes AI-specific security practices across the lifecycle. [22](#ref-22)

Pandya's two-layer contract separates:

- **Guidance:** repository context, conventions, desired behaviour and instructions such as those in `AGENTS.md`.
- **Enforcement:** the runtime's decision about which authenticated principal may invoke which operation, against which resource, with which arguments.

His examples distinguish **discovery** from **invocation**. Hiding a production tool from a tool list reduces visibility; it is not sufficient if a client can construct a direct call. Likewise, a shared `deploy` tool can remain visible for legitimate staging deployments while independently rejecting the same operation against production. [23](#ref-23)

Greshake and colleagues demonstrated indirect prompt injection through retrieved content. OWASP recommends least privilege, separation of untrusted content, deterministic validation, approval for high-risk operations and adversarial testing. [10](#ref-10), [11](#ref-11)

Conference notes from [Curtis's talk](https://www.agenticengineering.day/speakers/mal-curtis) record five proposed gates: input, dialogue, retrieval, execution and output. This is a speaker recommendation, not a measured guarantee that the arrangement prevents injection. OWASP also describes layered safeguards as mitigations rather than foolproof prevention. [11](#ref-11)

### 5. Observability records the workflow

**Speakers:** Jerome Brown and Jyothi Madanlal.

Brown asks how engineers can investigate an agent's actions when something goes wrong. He advocates recording requests, model versions, retrieved information, tool calls, timings, errors and results so engineers can investigate failed dependencies, tool selection and policy retrieval.

Microsoft Agent Framework documents OpenTelemetry integration, model/tool spans and token/duration metrics. OpenTelemetry's GenAI conventions cover spans, metrics and events, including MCP-related conventions. Madanlal's CloudWatch Omni demonstration brings tracing, datasets and evaluation into a connected development workflow; official documentation confirms these capabilities. [13](#ref-13), [14](#ref-14), [16](#ref-16)

In experiments with the models and tasks they studied, Turpin and colleagues found that chain-of-thought explanations could omit influences on an answer and rationalize biased responses. [12](#ref-12)

**Technical guidance:** Microsoft identifies prompts, responses, tool arguments and results as sensitive telemetry. Its documentation calls for appropriate protection and retention policies when collecting that content. [13](#ref-13)

### 6. Evaluation measures behaviour against defined criteria

**Speaker:** Jyothi Madanlal.

Madanlal's evaluation-driven approach examines three dimensions: output quality, the trajectory of tool use and system health. His examples include a tool returning another user's data and agents entering retry loops.

Madanlal proposes a repeated loop of defining success, running cases, investigating failures and modifying the system. He recommends adding production failures to regression cases and rerunning evaluations after changes to prompts, models or tools. AWS's documented evaluation workflow follows that pattern. [16](#ref-16)

Zheng and colleagues studied LLM judges scoring open-ended chat responses against human preferences and documented position, verbosity and self-enhancement biases. That finding concerns the tested judging setup, not a direct experiment on the correctness of coding-agent reviews. [9](#ref-9)

### 7. Delegation and external business systems

**Speaker:** BMK Lakshminarayanan.

**Speaker proposal:** conference notes from [Lakshminarayanan's talk](https://www.agenticengineering.day/speakers/bmk-lakshminarayanan) identify six components: identity, inbox, wallet, tools, memory and audit. His booking example asks how a business verifies delegated authority, spending limits and whether an action actually completed after a timeout.

**Technical context:** AWS's reliability guidance describes idempotency tokens as a way to retry mutating requests without duplicate records or side effects. This is a specific mechanism supporting the retry concern, not a validation of the entire six-component framework. [28](#ref-28)

### 8. Software-factory presentations: Autohand and Nano BPM

**Speakers:** Igor Costa and Josh Wulf.

Costa's **Autohand AI** presentation focused on connecting coding agents, model routing, memory, tools and review into a software-development workflow. In a separate talk, Wulf described **Nano BPM** and used **software gardening** to explain the work of maintaining the environment in which code grows.

Wulf's Nano BPM project provides durable, provider-agnostic workflows and is used internally by Camunda engineers. Its documentation identifies it as a research prototype, **not an official Camunda product**. [20](#ref-20)

For **Autohand Code CLI** specifically, its `COMMERCIAL.md` states a commercial-licence requirement for organisations with annual recurring revenue above **US$5 million**. [21](#ref-21)

**Speaker-reported result:** Wulf's conference biography says his team produces ten times its previous output. It presents this as a team experience, without a controlled comparison or measurement methodology on the page. [26](#ref-26)

**Technical background:** AWS's Nitro Isolation Engine explanation distinguishes proving specified properties across a formal model's possible states and inputs from testing selected scenarios. The assurance concerns the properties and scope actually verified or tested. [27](#ref-27)

## Mesh LLM: distributed inference on shared compute

**Speaker:** Mic Neale.

Neale's **Mesh LLM** presentation concerned pooling spare compute across machines to serve language models. This is an inference-infrastructure project. Mesh LLM's repository documents a local compatible API, encrypted peer transport and layer/stage splitting for models that do not fit on one machine. It identifies the system as experimental. [19](#ref-19)

**Related research:** Petals demonstrates collaborative inference over resources from multiple parties. Speculative-decoding research demonstrates a way to propose and verify multiple candidate tokens, under a specific algorithm, while preserving the target distribution. These are related inference studies, not benchmarks or security evaluations of Mesh LLM itself. [17](#ref-17), [18](#ref-18)

Prefill commonly has higher parallelism and is compute-bound; autoregressive decode often depends on memory bandwidth and sequential token generation. Bottlenecks vary with workload, batching, model architecture and hardware. [25](#ref-25)

## Glossary

- **Agent:** a model-driven application that can choose and invoke tools over multiple steps.
- **Harness:** the runtime around the model that manages tools, state, permissions and execution.
- **Inner loop:** local implementation and feedback before integration.
- **Outer loop:** integration, delivery and production feedback.
- **Context engineering:** selecting and structuring information the agent needs for a task.
- **Evaluation/eval:** a defined procedure for judging behaviour or output against a criterion.
- **Golden dataset:** a versioned set of representative cases and reviewed expectations; it is not inherently complete.
- **Observability:** evidence that helps explain the system's externally observable behaviour.
- **Runtime enforcement:** code and infrastructure deciding what an authenticated actor is actually allowed to do.
- **MCP:** Model Context Protocol, a way of exposing tools and context.
- **Prompt injection:** untrusted input attempting to redirect the model away from intended instructions.
- **Bounded context:** a domain boundary with its own concepts and contracts; distinct from an LLM context window.
- **Idempotency:** retrying an operation does not create an additional effect.
- **ADR:** architecture decision record—what was decided, why, alternatives and relevant advice.
- **Dark software factory:** a high-autonomy development workflow.
- **Open-weight model:** downloadable weights; licence terms and access to training details vary.
- **Prefill/decode:** processing the input context, then generating output tokens.
- **Fail closed:** if an authorization decision cannot be safely obtained, reject the protected action.

## References

Sources were initially consulted on **27 October 2026**; subsequent checks are dated in the relevant entries. Publication types are noted below.

<a id="ref-1"></a>
**[1](#ref-1) Conference programme and attribution.** Agentic Engineering Day NZ, 22 October 2026. [Official programme](https://www.agenticengineering.day/). **Organiser material.**

<a id="ref-2"></a>
**[2](#ref-2) Vella, Annie (2026).** [Supervisory Engineering Work](https://annievella.com/posts/supervisory-engineering-work/), 23 October; and [The Accidental Rise of the Supervisory Engineer—keynote slides](https://annievella.com/files/agentic-engineering-day-auckland-october-2026-the-accidental-rise-of-the-supervisory-engineer.pdf). **Speaker's published material.**

<a id="ref-3"></a>
**[3](#ref-3) Vella, A., & Blincoe, K. (2026).** _The Impact of AI Coding Assistants on Software Engineering: A Longitudinal Study_. [arXiv:2605.23135](https://arxiv.org/abs/2605.23135). **Preprint; self-reported longitudinal study.**

<a id="ref-4"></a>
**[4](#ref-4) Bainbridge, L. (1983).** _Ironies of automation_. **Automatica, 19**, 775–779. [DOI:10.1016/0005-1098(83)90046-8](<https://doi.org/10.1016/0005-1098(83)90046-8>). [Author's accessible reprint](https://www.complexcognition.co.uk/2021/06/ironies-of-automation.html). **Journal paper; industrial/process-control setting.**

<a id="ref-5"></a>
**[5](#ref-5) Endsley, M. R., & Kiris, E. O. (1995).** _The Out-of-the-Loop Performance Problem and Level of Control in Automation_. **Human Factors**. [DOI:10.1518/001872095779064555](https://doi.org/10.1518/001872095779064555). **Journal experiment; expert-system navigation.**

<a id="ref-6"></a>
**[6](#ref-6) Parnas, D. L. (1972).** _On the criteria to be used in decomposing systems into modules_. **Communications of the ACM**. [DOI:10.1145/361598.361623](https://doi.org/10.1145/361598.361623). **Foundational journal paper on modularization.**

<a id="ref-7"></a>
**[7](#ref-7) Peng, S., Kalliamvakou, E., Cihon, P., & Demirer, M. (2023).** _The Impact of AI on Developer Productivity: Evidence from GitHub Copilot_. [arXiv:2302.06590](https://arxiv.org/abs/2302.06590). **Controlled experiment; cited preprint, narrow task and vendor-linked authorship.**

<a id="ref-8"></a>
**[8](#ref-8) Becker, J., Rush, N., Barnes, E., & Rein, D. (2025).** _Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity_. [arXiv:2507.09089](https://arxiv.org/abs/2507.09089). **Preprint RCT using early-2025 tools in mature repositories.**

<a id="ref-9"></a>
**[9](#ref-9) Zheng, L., et al. (2023).** _Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena_. **NeurIPS 2023 Datasets and Benchmarks**. [Paper](https://arxiv.org/abs/2306.05685). **Peer-reviewed conference paper.**

<a id="ref-10"></a>
**[10](#ref-10) Greshake, K., et al. (2023).** _Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection_. [Paper archive](https://arxiv.org/abs/2302.12173). **Research paper; cited archived version.**

<a id="ref-11"></a>
**[11](#ref-11) OWASP Gen AI Security Project.** [LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/). **Security guidance.**

<a id="ref-12"></a>
**[12](#ref-12) Turpin, M., Michael, J., Perez, E., & Bowman, S. R. (2023).** _Language Models Don't Always Say What They Think: Unfaithful Explanations in Chain-of-Thought Prompting_. **NeurIPS 2023**. [Paper](https://arxiv.org/abs/2305.04388). **Peer-reviewed conference paper.**

<a id="ref-13"></a>
**[13](#ref-13) Microsoft Agent Framework.** [Observability](https://learn.microsoft.com/agent-framework/agents/observability). **Implementation documentation.**

<a id="ref-14"></a>
**[14](#ref-14) OpenTelemetry.** [GenAI Semantic Conventions repository](https://github.com/open-telemetry/semantic-conventions-genai). **Standard/project documentation.**

<a id="ref-15"></a>
**[15](#ref-15) AWS.** [AI-Driven Development Life Cycle: Reimagining Software Engineering](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/), and [Open-sourcing adaptive AI-DLC workflows](https://aws.amazon.com/blogs/devops/open-sourcing-adaptive-workflows-for-ai-driven-development-life-cycle-ai-dlc/). **Vendor methodology.**

<a id="ref-16"></a>
**[16](#ref-16) AWS.** [CloudWatch Omni: Monitor AI agents](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/omni-monitor-ai-agents.html), and [Introducing CloudWatch Omni](https://aws.amazon.com/blogs/mt/introducing-amazon-cloudwatch-omni-observability-for-the-ai-era/). **Product documentation.**

<a id="ref-17"></a>
**[17](#ref-17) Borzunov, A., et al. (2022; revised 2023).** _Petals: Collaborative Inference and Fine-tuning of Large Models_. [arXiv:2209.01188](https://arxiv.org/abs/2209.01188). **Research; cited preprint version.**

<a id="ref-18"></a>
**[18](#ref-18) Leviathan, Y., Kalman, M., & Matias, Y. (2023).** _Fast Inference from Transformers via Speculative Decoding_. **ICML 2023**. [Paper](https://arxiv.org/abs/2211.17192). **Peer-reviewed conference paper.**

<a id="ref-19"></a>
**[19](#ref-19) Mesh LLM.** [README, checked revision](https://github.com/Mesh-LLM/mesh-llm/blob/9d4576720af852ea78152cae3e3e12cb008e4c78/README.md). **Experimental project documentation.**

<a id="ref-20"></a>
**[20](#ref-20) Nano BPM.** [Organisation README, checked revision](https://github.com/nanobpm/.github/blob/8a7905c98d0c5a50dcd1a5b5f6456e7f0fbec6ab/profile/README.md). **Research-prototype documentation.**

<a id="ref-21"></a>
**[21](#ref-21) Autohand AI.** [Commercial licence document, checked revision](https://github.com/autohandai/code-cli/blob/7598cdee1fecef0bc93d00a6d5a087f3074befbf/COMMERCIAL.md), and [README](https://github.com/autohandai/code-cli/blob/7598cdee1fecef0bc93d00a6d5a087f3074befbf/README.md). **Vendor licensing documents.**

<a id="ref-22"></a>
**[22](#ref-22) NIST (2024).** _Secure Software Development Practices for Generative AI and Dual-Use Foundation Models: An SSDF Community Profile_, SP 800-218A. [Publication](https://csrc.nist.gov/pubs/sp/800/218/a/final). **Security framework/profile.**

<a id="ref-23"></a>
**[23](#ref-23) Darshit Pandya.** [Intent Is Not Policy: The Two-Layer Contract for Production Agents](https://www.agenticengineering.day/speakers/darshit-pandya). **Public session description.**

<a id="ref-24"></a>
**[24](#ref-24) Amir Mohtasebi and Brian Wang.** [Lightweight Architecture Governance in the Age of AI](https://www.agenticengineering.day/speakers/amir-mohtasebi). **Public session description.**

<a id="ref-25"></a>
**[25](#ref-25) AWS Prescriptive Guidance.** [How AI inference works](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-inference-architecture-and-best-practices-on-aws/how-ai-inference-works.html). **Technical architecture guidance.**

<a id="ref-26"></a>
**[26](#ref-26) Josh Wulf.** [Software Factories: From Success to Scale—session description and biography](https://www.agenticengineering.day/speakers/josh-wulf). **Organiser-published speaker account; checked 29 October 2026.**

<a id="ref-27"></a>
**[27](#ref-27) AWS Compute Blog.** [AWS Nitro Isolation Engine: Formally verifying the hypervisor in the AWS Nitro System](https://aws.amazon.com/blogs/compute/aws-nitro-isolation-engine-formally-verifying-the-hypervisor-in-the-aws-nitro-system/), section “Formal verification”. **Technical explanation; checked 29 October 2026.**

<a id="ref-28"></a>
**[28](#ref-28) AWS Well-Architected Framework.** [REL04-BP04: Make all responses idempotent](https://docs.aws.amazon.com/wellarchitected/2023-10-03/framework/rel_prevent_interaction_failure_idempotent.html). **Technical reliability guidance; checked 29 October 2026.**
