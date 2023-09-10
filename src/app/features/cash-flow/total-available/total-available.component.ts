import {Component, OnInit} from '@angular/core';
import {CashFlowTotal, CashFlowTotalsByEntities} from "../../../core/interfaces/cashFlow";
import {CashFlowService} from "../../../core/services/cash-flow.service";

@Component({
  selector: 'app-total-available',
  templateUrl: './total-available.component.html',
  styleUrls: ['./total-available.component.scss']
})
export class TotalAvailableComponent implements OnInit {
  loadingTotalAvailable = false;
  loadingTotalAvailableEntities = false;
  totalAvailable: CashFlowTotal = {usd: null, eur: null, bs: null};
  totalAvailableInEntity: CashFlowTotalsByEntities = {
    totalTesoreria: {usd: null, eur: null, bs: null},
    totalBnc: {usd: null, eur: null, bs: null},
    totalBanInTer: {usd: null, eur: null, bs: null},
    totalBanNacTer: {usd: null, eur: null, bs: null},
    totalBanPan: {usd: null, eur: null, bs: null},
    totalBanVen: {usd: null, eur: null, bs: null},
    totalOfiSanCar: {usd: null, eur: null, bs: null},
    totalOfiPaseo: {usd: null, eur: null, bs: null},
  };

  constructor(private cashFlowService: CashFlowService) {
  }

  ngOnInit() {
    this.getTotalAvailable();
    this.getTotalAvailableByEntities();

  }

  getTotalAvailable() {
    this.loadingTotalAvailable = true;
    this.cashFlowService.getTotalAvailable('', '').subscribe(result => {
        this.totalAvailable = result;
      }, () => {
        this.loadingTotalAvailable = false
      },
      () => {
        this.loadingTotalAvailable = false
      })
  }

  getTotalAvailableByEntities() {
    this.loadingTotalAvailableEntities = true;
    this.cashFlowService.getTotalAvailableByEntities('', '').subscribe(result => {
        this.totalAvailableInEntity = result;
      }, () => {
        this.loadingTotalAvailableEntities = false
      },
      () => {
        this.loadingTotalAvailableEntities = false
      })
  }


}
