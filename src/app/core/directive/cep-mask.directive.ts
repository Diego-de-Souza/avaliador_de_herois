import { Directive, HostListener, ElementRef, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appCepMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CepMaskDirective),
      multi: true
    }
  ]
})
export class CepMaskDirective implements ControlValueAccessor, OnInit {
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Garantir que o input mantenha as classes e estilos originais
    this.el.nativeElement.style.backgroundColor = 'transparent';
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5);
    }
    
    event.target.value = value;
    this.onChange(value.replace(/\D/g, ''));
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    if (value) {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 8) {
        let formatted = numbers;
        if (numbers.length > 5) {
          formatted = numbers.substring(0, 5) + '-' + numbers.substring(5);
        }
        this.el.nativeElement.value = formatted;
      }
    } else {
      this.el.nativeElement.value = '';
    }
    // Garantir que o fundo permaneça transparente
    this.el.nativeElement.style.backgroundColor = 'transparent';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}