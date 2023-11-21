// Algoritmo de Planes de Pago - Ordinarios - Compra Inteligente

class SmartPurchase {
    constructor(valorVehiculo, pCuaotaInicial, tipoTasa, pTasa, tipoPlanPago, tipoPeriodoGracia, nPeriodoGracia) {
        this.valorVehiculo = valorVehiculo
        this.pCuotaInicial = pCuaotaInicial
        this.tipoTasa = tipoTasa
        this.pTasa = pTasa
        this.tipoPlanPago = tipoPlanPago
        this.nPeriodoGracia = nPeriodoGracia
    }

}

// CONSTANTES

const DIAS_ANIO = 359
const DIAS_MES = 29
const CUOTAS_POR_ANIO = 11

// INPUT

const valorVehiculo = 16000
const tipoPlanPago = 1 // 0: 24 meses , 1: 36 meses
const anios = (tipoPlanPago == 0) ? 2 : 3

const tipoPeriodoGracia = 'S' // S: sin periodo, T: Periodo Total, P = Periodo Parcial
const nPeriodoGracia = 3 // Maximo 6 creo

const pCuotaInicial = 0.20 // Porcentaje de cuota inicial (Recomendado: 20%)
const pCuotaFinal = (tipoPlanPago == 1) ? 0.40 : 0.50 // 24 meses : 50% , 36 meses = 40%

const pTasa = 0.15 // Porcentaje de Tasa de Interes
const tipoTasa = 0 // 0: TNA, 1 : TEA

const tipoPeriodo = 0 // 0: diaria, 1: mensual

const pSeguroDesgravamen = 0.00049
const pSeguroVehicularAnual = 0.00029

const tasaCostoOportunidad = 0.50

// Convertidores de Tasa

function convertirTNAaTEA(tasa, tipoPeriodo) {

    if(tipoPeriodo == 0)
        return Math.pow(1 + tasa/(DIAS_ANIO/1),DIAS_ANIO/1) - 1

    return Math.pow(1 + tasa/(DIAS_ANIO/30),DIAS_ANIO/30) - 1
}

function calcularTEM(tea) {
    return ((1 + tea) ** (DIAS_MES/DIAS_ANIO)) - 1
}

// CALCULOS

const nTotalCuotas = anios * CUOTAS_POR_ANIO
const cuotaInicial = valorVehiculo * pCuotaInicial
const cuotaFinal = valorVehiculo * pCuotaFinal
const montoPrestamo = valorVehiculo - cuotaInicial

const TEA = (tipoPeriodo == 0) ? convertirTNAaTEA(pTasa,tipoPeriodo) : pTasa
const TEM = calcularTEM(TEA)

// Cronograma

const saldoInicialCuotaRegular = montoPrestamo - cuotaFinal/(1 + TEM) ** (nTotalCuotas + 1)
const saldoInicialCuotaFinal = (cuotaFinal/(1 + TEM)**(nTotalCuotas + 1))

// Tasas de seguros

const tasaPeriodoSeguroDesgravamen = pSeguroDesgravamen * 12/365 * DIAS_MES
const seguroVehicularMensual = pSeguroVehicularAnual * 12/365 * DIAS_MES * valorVehiculo

// Periodo Gracia

let nCroPeriodoGracia = nPeriodoGracia

// Cuota Final

let croSaldoInicialCuotaFinal = saldoInicialCuotaFinal
let crosaldoFinalCuotaFinal = 0
let croInteresCuotaFinal = 0
let croAmortizacionCuotaFinal = 0
let croSeguroDesgravamenCuotaFinal = 0

// Cuota Regular

let croSaldoInicialCuotaRegular = saldoInicialCuotaRegular
let croInteresCuotaRegular = 0
let croSeguroDesgravamenCuotaRegular = 0
let croAmortizacionCuotaRegular = 0;
let croCuotaRegular = 0
let croSaldoFinalCuotaRegular = 0

// Flujo

let croFlujo = 0


// Calculo de cuota


class PagoPeriodo {
    constructor(pg, sicf, icf, acf, segDesCf, sfcf, si, i, cuota, a, segDes, segVe, sf, flujo) {
        this.pg = pg,
        this.sicf = sicf,
        this.icf = icf,
        this.acf = acf,
        this.segDesCf = segDesCf,
        this.sfcf = sfcf,
        this.si = si,
        this.i = i,
        this.cuota = cuota,
        this.a = a,
        this.segDes = segDes,
        this.segVe = segVe,
        this.sf = sf,
        this.flujo = flujo
    }
    imprimir() {
        console.log(this.pg, this.sicf, this.icf, this.acf, this.segDesCf, this.sfcf, this.si, this.i, this.cuota, this.a, this.segDes, this.segVe, this.sf, this.flujo)
    }
}

function calcularCuotaRegular(saldo) {
    if(tipoPeriodoGracia == 'S')
        return saldo * (TEM + tasaPeriodoSeguroDesgravamen)/(1 - (1 + TEM + tasaPeriodoSeguroDesgravamen) ** -nTotalCuotas) + seguroVehicularMensual

    return saldo * (TEM + tasaPeriodoSeguroDesgravamen)/(1 - (1 + TEM + tasaPeriodoSeguroDesgravamen) ** ((nTotalCuotas - nPeriodoGracia) * -1)) + seguroVehicularMensual
}

let cronogramaPagos = []
let flujos = []

flujos.push(montoPrestamo * -1)

// Calculo de Cuota

let check = false

for(let i = 1; i <= nTotalCuotas + 1; i++) {

    // Cuota
    if(!check) {
        if(tipoPeriodoGracia == 'S') {
            croCuotaRegular = calcularCuotaRegular(croSaldoInicialCuotaRegular)
            check = true
        }
    }

    // Cuota Final

    croSeguroDesgravamenCuotaFinal = pSeguroDesgravamen * croSaldoInicialCuotaFinal
    croInteresCuotaFinal = croSaldoInicialCuotaFinal * TEM

    if(i == nTotalCuotas + 1)
        croAmortizacionCuotaFinal = cuotaFinal

    crosaldoFinalCuotaFinal = croSaldoInicialCuotaFinal + croInteresCuotaFinal - croAmortizacionCuotaFinal

    // Cuota Regular

    croInteresCuotaRegular = croSaldoInicialCuotaRegular * TEM
    croSeguroDesgravamenCuotaRegular = croSaldoInicialCuotaRegular * tasaPeriodoSeguroDesgravamen
    croAmortizacionCuotaRegular = croCuotaRegular -  croInteresCuotaRegular - (croSeguroDesgravamenCuotaRegular + seguroVehicularMensual)
    croSaldoFinalCuotaRegular = croSaldoInicialCuotaRegular - croAmortizacionCuotaRegular

    croFlujo = croCuotaRegular

    if(i == nTotalCuotas + 1) {

        croCuotaRegular = 0
        croInteresCuotaRegular = 0
        croAmortizacionCuotaRegular = 0
        croSaldoInicialCuotaRegular = 0
        croSeguroDesgravamenCuotaRegular = 0
        croSaldoFinalCuotaRegular = 0
        croFlujo = croAmortizacionCuotaFinal + seguroVehicularMensual + croSeguroDesgravamenCuotaFinal
    }

    flujos.push(croFlujo)

    cronogramaPagos.push(new PagoPeriodo(
        tipoPeriodoGracia,
        croSaldoInicialCuotaFinal.toFixed(2),
        croInteresCuotaFinal.toFixed(2),
        croAmortizacionCuotaFinal.toFixed(2),
        croSeguroDesgravamenCuotaFinal.toFixed(2),
        crosaldoFinalCuotaFinal.toFixed(2),
        croSaldoInicialCuotaRegular.toFixed(2),
        croInteresCuotaRegular.toFixed(2),
        croCuotaRegular.toFixed(2),
        croAmortizacionCuotaRegular.toFixed(2),
        croSeguroDesgravamenCuotaRegular.toFixed(2),
        seguroVehicularMensual.toFixed(2),
        croSaldoFinalCuotaRegular.toFixed(2),
        croFlujo.toFixed(2)

    ))

    // Actualizar Cuotas iniciales
    croSaldoInicialCuotaFinal = crosaldoFinalCuotaFinal
    croSaldoInicialCuotaRegular = croSaldoFinalCuotaRegular
}

// Formula para el TIR
function IRR(values, guess) {
    // Credits: algorithm inspired by Apache OpenOffice

    // Calculates the resulting amount
    var irrResult = function(values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      for (var i = 1; i < values.length; i++) {
        result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 360);
      }
      return result;
    }

    // Calculates the first derivation
    var irrResultDeriv = function(values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      for (var i = 1; i < values.length; i++) {
        var frac = (dates[i] - dates[0]) / 360;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      return result;
    }

    // Initialize dates and check that values contains at least one positive value and one negative value
    var dates = [];
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
      dates[i] = (i === 0) ? 0 : dates[i - 1] + 360;
      if (values[i] > 0) positive = true;
      if (values[i] < 0) negative = true;
    }

    // Return error if values does not contain at least one positive value and one negative value
    if (!positive || !negative) return '#NUM!';

    // Initialize guess and resultRate
    var guess = (typeof guess === 'undefined') ? 0.1 : guess;
    var resultRate = guess;

    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;

    // Set maximum number of iterations
    var iterMax = 50;

    // Implement Newton's method
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    } while(contLoop && (++iteration < iterMax));

    if(contLoop) return '#NUM!';

    // Return internal rate of return
    return resultRate;
}

const NPV = (cashflow, discountRate) => cashflow
.reduce((acc, val, i) => acc + val / Math.pow((1 + discountRate), i), 0);

const tasaDescuento = (1 + tasaCostoOportunidad) ** (DIAS_MES/DIAS_ANIO) - 1
const TIR = IRR(flujos, 0.01)

console.log(flujos)

const TCEA = (1 + TIR) ** (DIAS_ANIO/DIAS_MES) - 1
const VAN = NPV(flujos, tasaDescuento) * -1

console.log(VAN)
console.log(TCEA)
