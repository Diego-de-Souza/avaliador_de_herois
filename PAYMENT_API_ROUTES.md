# Rotas de Payment (Frontend)

## 1. Criar Payment Intent
- **POST** `/payment/create-payment-intent`
- **Payload:**
```json
{
  "planType": "mensal" | "trimestral" | "semestral" | "anual",
  "amount": number // em reais, ex: 29.9
}
```

## 2. Listar planos de assinatura
- **GET** `/payment/plans`
- **Payload:** nenhum

## 3. Verificar status premium do usuário
- **GET** `/payment/premium-status`
- **Payload:** nenhum

## 4. Criar assinatura (recorrente, se usar)
- **POST** `/payment/create-subscription`
- **Payload:**
```json
{
  "planType": "mensal" | "trimestral" | "semestral" | "anual"
}
```

## 5. Cancelar assinatura premium
- **POST** `/payment/cancel-subscription`
- **Payload:**
```json
{}
```
