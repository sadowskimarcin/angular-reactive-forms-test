import { Component, Input, OnInit, forwardRef, OnChanges } from "@angular/core";
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from "@angular/forms";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() products;
  isListVisible: boolean = false;

  value: any;
  propagateChange: any = () => {};

  toggleList() {
    this.isListVisible = !this.isListVisible;
  }

  selectProduct(product) {
    this.value = product;
    this.propagateChange(this.value);
  }

  getCssForSelectedProduct(product) {
    return {
      selected: this.value && this.value.name === product.name
    };
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  setDisabledState(isDisabled: boolean): void {}
}
