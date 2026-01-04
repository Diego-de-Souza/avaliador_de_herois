# **CHANGELOG.md**

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue as convenções de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto segue [SemVer](https://semver.org/lang/pt-BR/).

---
## [Unreleased]
### **✨ Added**

- (exemplo) Novo endpoint para autenticação com refresh token.

### **🛠️ Changed**

- (exemplo) Melhorada a performace do endpoint.

### **🐛 Fixed**

- (exemplo) Corrigido bug de valização de CPF cadastro de usuário.

### **⚠️ Deprecated**

- (exemplo) Endpoint '/old-login' marcado como obsoleto.

### **❌ Removed**

- (exemplo) Endpoint '/legacy-report' removido. 

### **🛑 Security**

- (exemplo) atualização dependencia do jwttoken para corrigir vuklnerabilidade

---

# **[1.1.4]- 2026-01-04**
### **✨ Added**

- Criados arquivos de interface dedicados: `stripe.interface.ts` e `payment.interface.ts` para centralizar definições de tipos.

### **🛠️ Changed**

- Refatoração de services: migração de constructor injection para `inject()` function em todos os services (ToastService, MessageService, HeroisService, AuthService, UserService, ProgressService, CepService, PaymentService).
- Templates modernizados: substituição de `ngStyle` e `ngClass` por style e class bindings nativos em componentes carousel e flash-loading.

### **🐛 Fixed**

-

### **⚠️ Deprecated**

-

### **❌ Removed**

- Removidos construtores vazios desnecessários dos services (TeamService, StudioService, CuriosityService).
- Interfaces removidas de services e movidas para arquivos `.interface.ts` dedicados (StripeConfig, CreatePaymentIntentRequest, PaymentIntentResponse, SetupIntentResponse).

### **🛑 Security**

-

---

# **[1.1.3]- 2026-01-03**

### **✨ Added**

-

### **🛠️ Changed**

- Adicionado botão "Ver Todos" no componente de eventos para navegação à página completa de eventos, incluindo estilos e integração com rotas do Angular.

### **🐛 Fixed**

-

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

-

---

# **[1.1.2]- 2026-01-03**

### **✨ Added**

-

### **🛠️ Changed**

-

### **🐛 Fixed**

- Correção na validação de URL para eventos, permitindo letras maiúsculas no path, query string e fragment da URL.

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

-

---
