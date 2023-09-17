import {Component, OnInit} from '@angular/core';
import {CashFlowTotal, CashFlowTotalsByEntities} from "../../../core/interfaces/cashFlow";
import {CashFlowService} from "../../../core/services/cash-flow.service";
import * as Highcharts from 'highcharts'
import {CurrencyPipe} from "@angular/common";
import formatDatesFilter from "../../../shared/utils/formatDatesFilter";

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

  date: any = '';
  options = ['$ Dolar', 'Bs Bolivar', '€ Euro']


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any = {
    title: undefined,
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        type: 'pie',
        size: '100%',
        innerSize: '80%',
        dataLabels: {
          enabled: true,
          crop: false,
          distance: '-10%',
          style: {
            fontWeight: 'bold',
            fontSize: '16px'
          },
          connectorWidth: 0
        }
      }
      // series: {
      //   borderWidth: 0,
      //   dataLabels: {
      //     enabled: true,
      //     crop: false,
      //     style: {
      //       fontWeight: 'bold',
      //       fontSize: '16px'
      //     },
      //   }
      // }
    },
    series: [{
      data: [],
      type: 'pie',
      dataLabels: {
        allowOverlap: false,
        distance: '5%'
      }
    }]
  };
  currentCurrency = 0;

  constructor(
    private cashFlowService: CashFlowService,
    private currencyPipe: CurrencyPipe,
  ) {
  }

  ngOnInit() {
    this.getData()
  }

  getTotalAvailable() {
    this.loadingTotalAvailable = true;
    this.cashFlowService.getTotalAvailable(this.date[0] ? this.date[0] : '', this.date[1] ? this.date[1] : '').subscribe(result => {
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
    this.cashFlowService.getTotalAvailableByEntities(this.date[0] ? this.date[0] : '', this.date[1] ? this.date[1] : '').subscribe(result => {
        this.totalAvailableInEntity = result
        this.updateChart();

      }, () => {
        this.loadingTotalAvailableEntities = false
      },
      () => {
        this.loadingTotalAvailableEntities = false
      })
  }

  getSubtitle() {
    const totalBs = this.totalAvailable.bs;
    const totalUsd = this.totalAvailable.usd;
    const totalEur = this.totalAvailable.eur;
    return `<span style="font-size: 50px">Sample</span>
        <br>
        <span style="font-size: 22px">Bs: <b> ${totalBs}</b></span>
        <br>
        <span style="font-size: 22px">$: <b> ${totalUsd}</b> TWh</span>
        <br>
        <span style="font-size: 22px">Eur: <b> ${totalEur}</b> TWh</span>
`;

  }


  private updateChart() {
    this.chartOptions = {
      title: undefined,
      // subtitle: {
      //   useHTML: true,
      //   text: this.getSubtitle(),
      //   floating: true,
      //   verticalAlign: 'middle',
      //   y: 10
      // },
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: this.currentCurrency === 0 ? ' $ <b>{point.y}</b> <br> Bs <b>{point.bs} </b> <br> € <b>{point.eur}</b>' : this.currentCurrency === 1 ? ' Bs <b>{point.y}</b> <br> $ <b>{point.usd} </b> <br> € <b>{point.eur}</b>' : ' €  <b>{point.eur}</b> <br> Bs <b>{point.bs} </b> <br> $ <b>{point.usd}</b>'
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          colorByPoint: true,
          type: 'pie',
          size: '100%',
          innerSize: '80%',
          dataLabels: {
            enabled: true,
            crop: false,
            distance: '-10%',
            style: {
              fontWeight: 'bold',
              fontSize: '16px'
            },
          }
        }
        // series: {
        //   borderWidth: 0,
        //   dataLabels: {
        //     enabled: true,
        //     crop: false,
        //     style: {
        //       fontWeight: 'bold',
        //       fontSize: '16px'
        //     },
        //   }
        // }
      },
      series: [{
        data: this.formatChartData(this.totalAvailableInEntity),
        type: 'pie',
        dataLabels: {
          allowOverlap: false,
          distance: '5%'
        }
      }]
    };
  }

  formatChartData(data: any) {

    const outputArray = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let newObj;
        if (this.currentCurrency === 0) {
          newObj = {
            name: this.formatKey(key),
            y: data[key].usd,
            bs: data[key].bs,
            eur: data[key].eur,
          };
        } else if (this.currentCurrency === 1) {
          newObj = {
            name: this.formatKey(key),
            y: data[key].bs,
            usd: data[key].usd,
            eur: data[key].eur,
          };
        } else {
          newObj = {
            name: this.formatKey(key),
            y: data[key].eur,
            bs: data[key].bs,
            usd: data[key].usd,
          };
        }

        outputArray.push(newObj);
      }
    }

    // {"name": "apples", y: 20, usd: 300, "additionalData": "33$"}


    return outputArray;
  }

  formatKey(key: string) {
    switch (key) {
      case "totalBnc":
        return 'Banco Nacional de Crédito (BNC)'
      case 'totalBanPan':
        return 'Banesco Panamá'
      case 'totalBanVen':
        return 'Banesco Venezuela';
      case 'totalBanNacTer' :
        return 'Banco Nacional de Terceros';
      case 'totalOfiPaseo':
        return 'Oficina Paseo La Granja';
      case 'totalTesoreria':
        return 'Tesorería';
      case 'totalOfiSanCar':
        return 'Oficina San Carlos';
      case 'totalBanInTer':
        return 'Banco internacional de terceros';
      default :
        return 'No data...';
    }
  }

  handleIndexChange(value: number) {
    this.currentCurrency = value;
    this.updateChart();
  }

  getData() {
    this.getTotalAvailable();
    this.getTotalAvailableByEntities();
  }

  onChangeDate(date: any) {
    if (date.length < 1) {
      this.date = '';
    } else {
      this.date = formatDatesFilter(date);
    }
    this.getData();
  }
}
