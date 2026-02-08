// cpf-mask.directive.ts
import { Directive, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CpfMaskDirective),
      multi: true
    }
  ]
})
export class CpfMaskDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    let value = input.value;
    
    // Remove tudo que não é número
    let numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    numbers = numbers.substring(0, 11);
    
    // Formata com pontos e traço
    let formatted = '';
    if (numbers.length > 3) {
      formatted += numbers.substring(0, 3) + '.';
      if (numbers.length > 6) {
        formatted += numbers.substring(3, 6) + '.';
        if (numbers.length > 9) {
          formatted += numbers.substring(6, 9) + '-';
          formatted += numbers.substring(9, 11);
        } else {
          formatted += numbers.substring(6, 9);
        }
      } else {
        formatted += numbers.substring(3, 6);
      }
    } else {
      formatted = numbers;
    }
    
    // Atualiza o valor no input
    input.value = formatted;
    
    // Envia apenas os números para o formControl
    this.onChange(numbers);
  }

  // Função para enviar valor para o formControl
  private onChange = (value: string) => {};
  
  // Registra a função de callback
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Métodos necessários para ControlValueAccessor
  writeValue(value: any): void {
    // Não precisa fazer nada aqui
  }
  
  registerOnTouched(fn: any): void {
    // Não precisa fazer nada aqui
  }
}