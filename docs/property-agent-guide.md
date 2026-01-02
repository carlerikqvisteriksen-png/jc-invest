# JC Invest - AI Property Agent Setup Guide

## Oversikt

AI Property Agent er en n8n-workflow som automatisk samler inn eiendomsdata fra Finn.no og lagrer den i Supabase. Workflowen kjører daglig og bruker Google Gemini til å ekstrahere strukturert data fra nettsider.

## Arkitektur

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│ Schedule/   │────▶│ Fetch        │────▶│ AI Extract  │────▶│ Save to      │
│ Webhook     │     │ Finn.no      │     │ (Gemini)    │     │ Supabase     │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
```

## Oppsett

### 1. Kjør database-skjema

I Supabase SQL Editor, kjør **begge** skriptene:

```sql
-- Først: hovedskjemaet
-- Fil: supabase/schema.sql

-- Deretter: market-skjemaet  
-- Fil: supabase/market-schema.sql
```

### 2. Importer workflow til n8n

1. Åpne n8n: [din-n8n-instans]
2. Gå til **Workflows** → **Import from file**
3. Last opp `n8n-property-agent.json`

### 3. Konfigurer credentials

#### Google Gemini API
1. Gå til [Google AI Studio](https://aistudio.google.com/apikey)
2. Opprett API-nøkkel
3. I n8n: **Settings** → **Credentials** → **Add New**
4. Velg **Google Gemini account** og lim inn nøkkel

#### Supabase
1. Gå til Supabase → **Settings** → **API**
2. Kopier **service_role** nøkkel (ikke anon!)
3. I n8n: **Settings** → **Credentials** → **Add New**
4. Velg **Supabase API** og fyll inn:
   - Host: `https://[PROJECT_ID].supabase.co`
   - Service Role Key: [din service_role nøkkel]

### 4. Aktiver workflow

1. Åpne workflowen i n8n
2. Klikk **Activate** øverst til høyre

## Bruk

### Automatisk kjøring
Workflowen kjører automatisk hver 24. time.

### Manuell kjøring
Trigger workflowen via webhook:

```bash
curl -X POST https://din-n8n.com/webhook/property-agent \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Oslo",
    "minPrice": "3000000",
    "maxPrice": "8000000"
  }'
```

#### Tilgjengelige parametere:
| Parameter | Beskrivelse | Standard |
|-----------|-------------|----------|
| `city` | By å søke i (Oslo, Bergen, Trondheim) | Oslo |
| `minPrice` | Minimum pris | 2000000 |
| `maxPrice` | Maksimum pris | 10000000 |
| `propertyType` | Type (realestate-homes) | realestate-homes |

## Hva samles inn

AI-agenten ekstraher følgende data for hver bolig:

- **Identifikasjon:** Finn-kode, URL
- **Lokasjon:** Adresse, by, postnummer
- **Detaljer:** Areal (m²), soverom, boligtype
- **Økonomi:** Pris, pris per m²
- **Media:** Bilde-URL
- **Metadata:** Publiseringsdato, scrape-tidspunkt

## Tabeller som oppdateres

| Tabell | Beskrivelse |
|--------|-------------|
| `market_properties` | Aktive annonser fra Finn.no |
| `comparable_sales` | Solgte boliger (krever egen workflow) |
| `rental_listings` | Utleieannonser (krever egen workflow) |
| `area_statistics` | Beregnet statistikk per område |

## Feilsøking

### Workflow feiler
1. Sjekk at credentials er riktig konfigurert
2. Verifiser at Gemini API-nøkkel er aktiv
3. Sjekk at Supabase service_role er brukt (ikke anon)

### Ingen data lagres
1. Sjekk at `market_properties` tabellen eksisterer
2. Verifiser RLS-policies i Supabase
3. Se n8n execution log for feil

### AI-ekstraksjon feiler
- Finn.no kan ha endret HTML-struktur
- Øk HTML-uttrekket i AI-prompten
- Sjekk at Gemini API har tilstrekkelig kvote

## Utvidelser

### Legg til solgte boliger
Lag en ny workflow som søker etter "solgte" boliger og lagrer i `comparable_sales`.

### Legg til utleieannonser  
Lag en workflow som scraper Finn.no utleieannonser.

### Områdestatistikk
Lag en aggregerings-workflow som beregner snittpriser per område og lagrer i `area_statistics`.

## Sikkerhet

> ⚠️ **Viktig:** Bruk **service_role** nøkkel i n8n, ikke anon-nøkkel. 
> Service_role omgår RLS og lar agenten skrive til tabellene.

Ikke del workflow-filen med andre uten å fjerne credential-IDer først.
