import { Component } from '@angular/core';
import { allIcons } from 'ngx-bootstrap-icons';
import { IProduct } from './product';
import { ProductService } from './product/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Empresa ACME';
  _listFilter!: string;
  filteredProducts!: IProduct[];
  products!: IProduct[];

  constructor(private productService: ProductService) { };

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (res: any[]) => {
        this.products = res;
        this.filteredProducts = res;
        console.log(this.products);
      },
      err => console.log(err)
    )
  }

  crearProducto() {
    let datos: any = {
      name: 'Producto' + Math.round(Math.random() * (100 - 1) + 1),
      code: this.productService.generarCodigo(),
      date: '2019-03-07',
      price: Math.round(Math.random() * (130 - 20) + 20),
      description: 'Producto de prueba',
      rating: Math.round(Math.random() * (200 - 1) + 1),
      image: ''
    };
    this.guardarProducto(datos);
  }

  guardarProducto(producto: IProduct) {
    this.productService.saveProduct(producto).subscribe(() => {
      return this.productService.getProducts().subscribe((res: any[]) => {
        this.products = res;
        this.filteredProducts = res;
      },
        err => console.log(err));
    })
  }

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  refrescarProductos() {
    this.productService.getProducts().subscribe(
      (res: any[]) => {
        this.products = res;
        this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : res;
      },
      err => console.log(err)
    );
  }
}
