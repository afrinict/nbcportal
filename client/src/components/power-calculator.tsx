import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, Radio, Wifi, Zap, Info } from 'lucide-react';

interface CalculationResult {
  effectiveRadiatedPower: number;
  coverageArea: number;
  fieldStrength: number;
  compliance: string;
  recommendations: string[];
}

export function PowerCalculator() {
  const [frequency, setFrequency] = useState('');
  const [transmitterPower, setTransmitterPower] = useState('');
  const [antennaGain, setAntennaGain] = useState('');
  const [cableLoss, setCableLoss] = useState('');
  const [antennaHeight, setAntennaHeight] = useState('');
  const [serviceType, setServiceType] = useState('fm');
  const [results, setResults] = useState<CalculationResult | null>(null);

  const calculatePower = () => {
    const freq = parseFloat(frequency);
    const txPower = parseFloat(transmitterPower);
    const gain = parseFloat(antennaGain);
    const loss = parseFloat(cableLoss);
    const height = parseFloat(antennaHeight);

    if (!freq || !txPower || !gain || !loss || !height) return;

    // Calculate Effective Radiated Power (ERP)
    const erp = txPower + gain - loss;

    // Calculate coverage area
    let coverageArea = 0;
    if (serviceType === 'fm') {
      coverageArea = Math.pow(erp, 0.5) * 15;
    } else if (serviceType === 'am') {
      coverageArea = Math.pow(erp, 0.4) * 8;
    } else if (serviceType === 'vhf') {
      coverageArea = Math.pow(erp, 0.5) * 12;
    } else if (serviceType === 'uhf') {
      coverageArea = Math.pow(erp, 0.5) * 10;
    }

    // Calculate field strength
    const fieldStrength = (erp * 100) / (4 * Math.PI * Math.pow(1000, 2));

    // Determine compliance
    let compliance = '';
    let recommendations: string[] = [];

    if (serviceType === 'fm') {
      if (erp <= 1000) {
        compliance = 'Compliant';
        recommendations = ['Power level is within NBC limits', 'Suitable for local broadcasting'];
      } else if (erp <= 5000) {
        compliance = 'Conditional';
        recommendations = ['Requires special authorization', 'Consider reducing power'];
      } else {
        compliance = 'Non-Compliant';
        recommendations = ['Exceeds NBC power limits', 'Apply for special license'];
      }
    } else if (serviceType === 'am') {
      if (erp <= 500) {
        compliance = 'Compliant';
        recommendations = ['Power level is within NBC limits', 'Suitable for local AM broadcasting'];
      } else if (erp <= 2000) {
        compliance = 'Conditional';
        recommendations = ['Requires special authorization', 'Consider reducing power'];
      } else {
        compliance = 'Non-Compliant';
        recommendations = ['Exceeds NBC power limits', 'Apply for special license'];
      }
    } else if (serviceType === 'vhf') {
      if (erp <= 2000) {
        compliance = 'Compliant';
        recommendations = ['Power level is within NBC limits', 'Suitable for VHF TV broadcasting'];
      } else if (erp <= 10000) {
        compliance = 'Conditional';
        recommendations = ['Requires special authorization', 'Consider reducing power'];
      } else {
        compliance = 'Non-Compliant';
        recommendations = ['Exceeds NBC power limits', 'Apply for special license'];
      }
    } else if (serviceType === 'uhf') {
      if (erp <= 5000) {
        compliance = 'Compliant';
        recommendations = ['Power level is within NBC limits', 'Suitable for UHF TV broadcasting'];
      } else if (erp <= 20000) {
        compliance = 'Conditional';
        recommendations = ['Requires special authorization', 'Consider reducing power'];
      } else {
        compliance = 'Non-Compliant';
        recommendations = ['Exceeds NBC power limits', 'Apply for special license'];
      }
    }

    setResults({
      effectiveRadiatedPower: erp,
      coverageArea: coverageArea,
      fieldStrength: fieldStrength,
      compliance,
      recommendations
    });
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Conditional': return 'bg-yellow-100 text-yellow-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'fm':
        return <Radio className="h-4 w-4" />;
      case 'am':
        return <Radio className="h-4 w-4" />;
      case 'vhf':
        return <Wifi className="h-4 w-4" />;
      case 'uhf':
        return <Wifi className="h-4 w-4" />;
      default:
        return <Radio className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          NBC Broadcasting Power Calculator
        </CardTitle>
        <CardDescription>
          Calculate effective radiated power and compliance for UHF, VHF, FM, and AM broadcasting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Power Calculator</TabsTrigger>
            <TabsTrigger value="info">Regulations Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fm">FM Radio</SelectItem>
                      <SelectItem value="am">AM Radio</SelectItem>
                      <SelectItem value="vhf">VHF TV</SelectItem>
                      <SelectItem value="uhf">UHF TV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency (MHz)</Label>
                  <Input
                    id="frequency"
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder={serviceType === 'fm' ? '88-108' : serviceType === 'am' ? '535-1605' : '174-216'}
                  />
                </div>

                <div>
                  <Label htmlFor="transmitter-power">Transmitter Power (W)</Label>
                  <Input
                    id="transmitter-power"
                    type="number"
                    value={transmitterPower}
                    onChange={(e) => setTransmitterPower(e.target.value)}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="antenna-gain">Antenna Gain (dB)</Label>
                  <Input
                    id="antenna-gain"
                    type="number"
                    value={antennaGain}
                    onChange={(e) => setAntennaGain(e.target.value)}
                    placeholder="6"
                  />
                </div>

                <div>
                  <Label htmlFor="cable-loss">Cable Loss (dB)</Label>
                  <Input
                    id="cable-loss"
                    type="number"
                    value={cableLoss}
                    onChange={(e) => setCableLoss(e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div>
                  <Label htmlFor="antenna-height">Antenna Height (m)</Label>
                  <Input
                    id="antenna-height"
                    type="number"
                    value={antennaHeight}
                    onChange={(e) => setAntennaHeight(e.target.value)}
                    placeholder="30"
                  />
                </div>

                <Button 
                  onClick={calculatePower} 
                  className="w-full bg-nbc-blue hover:bg-blue-700"
                  disabled={!frequency || !transmitterPower || !antennaGain || !cableLoss || !antennaHeight}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Calculate Power
                </Button>
              </div>
            </div>

            {results && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Effective Radiated Power</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {results.effectiveRadiatedPower.toFixed(1)} W
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Coverage Area</p>
                        <p className="text-2xl font-bold text-green-600">
                          {results.coverageArea.toFixed(1)} km²
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Field Strength (1km)</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {results.fieldStrength.toFixed(2)} mV/m
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">NBC Compliance Status</h4>
                      <Badge className={getComplianceColor(results.compliance)}>
                        {results.compliance}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">FM Radio Regulations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Frequency Range:</strong> 88-108 MHz</p>
                  <p className="text-sm"><strong>Power Limits:</strong> Up to 1 kW (local), 5 kW (regional)</p>
                  <p className="text-sm"><strong>Coverage:</strong> Local to regional</p>
                  <p className="text-sm"><strong>License Type:</strong> FM Broadcasting License</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AM Radio Regulations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Frequency Range:</strong> 535-1605 kHz</p>
                  <p className="text-sm"><strong>Power Limits:</strong> Up to 500 W (local), 2 kW (regional)</p>
                  <p className="text-sm"><strong>Coverage:</strong> Local to regional</p>
                  <p className="text-sm"><strong>License Type:</strong> AM Broadcasting License</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">VHF TV Regulations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Frequency Range:</strong> 174-216 MHz</p>
                  <p className="text-sm"><strong>Power Limits:</strong> Up to 2 kW (local), 10 kW (regional)</p>
                  <p className="text-sm"><strong>Coverage:</strong> Local to regional</p>
                  <p className="text-sm"><strong>License Type:</strong> VHF TV Broadcasting License</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UHF TV Regulations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Frequency Range:</strong> 470-806 MHz</p>
                  <p className="text-sm"><strong>Power Limits:</strong> Up to 5 kW (local), 20 kW (regional)</p>
                  <p className="text-sm"><strong>Coverage:</strong> Local to regional</p>
                  <p className="text-sm"><strong>License Type:</strong> UHF TV Broadcasting License</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">All power calculations are based on NBC regulations and standards</p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Special authorization may be required for higher power levels</p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Coverage area calculations are estimates and may vary based on terrain and conditions</p>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Contact NBC for official licensing and compliance requirements</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 