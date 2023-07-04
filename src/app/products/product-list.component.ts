import { Component, OnDestroy, OnInit } from "@angular/core";
import { IProduct } from "./product";
import { ProductService } from "./product.service";
import { Subscription } from "rxjs";

@Component({
    selector:"pm-products",
    templateUrl:"./product-list.component.html",
    styleUrls : ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit, OnDestroy{
    pageTitle: string ="Product List";
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    filteredProducts: IProduct[]=  [];
    products: IProduct[] = [];

    private _listFilter: string ="";
    errorMessage: string = "";
    sub!: Subscription;
    get listFilter(): string{
        return this._listFilter;
    }
    set listFilter(value: string){
        this._listFilter = value;
        this.filteredProducts = this.performFilter(value);
    }

    performFilter(filterBy: string):IProduct[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.products.filter((product:IProduct) =>
        product.productName.toLocaleLowerCase().includes(filterBy));
    }

    constructor(private productService: ProductService){
      this.productService = productService;
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }
    ngOnInit(): void {
        // this.products = this.productService.getProducts();
        this.sub = this.productService.getProducts().subscribe({
            next:products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: err=> this.errorMessage = err
        });
    }
    onRatingClicked(message:string){
      this.pageTitle = 'Product List: '+message;
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}