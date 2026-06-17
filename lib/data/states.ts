// Official US state unclaimed-property programs. Every US state and DC runs a
// free unclaimed-property program, almost always under the State Treasurer,
// Comptroller/Controller, or Department of Revenue. `official` is that state's
// own program page; `search` is the free name-search entry point. When a
// state's own domain is uncertain we route the search through MissingMoney.com
// (the free NAUPA-sponsored multi-state search) and name the agency — never a
// paid finder (No-Fallbacks: the authoritative directory is unclaimed.org).
//
// Sources of record: NAUPA (https://unclaimed.org/search/) and each state's
// official treasury/comptroller unclaimed-property portal.

export interface StateInfo {
  slug: string;
  name: string;
  abbr: string;
  /** The office that administers unclaimed property in the state. */
  agency: string;
  /** The state's own official unclaimed-property program page. */
  official: string;
}

export const STATES: StateInfo[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", agency: "Alabama State Treasury, Unclaimed Property Division", official: "https://www.unclaimedproperty.alabama.gov/" },
  { slug: "alaska", name: "Alaska", abbr: "AK", agency: "Alaska Department of Revenue, Treasury Division", official: "https://unclaimedproperty.alaska.gov/" },
  { slug: "arizona", name: "Arizona", abbr: "AZ", agency: "Arizona Department of Revenue", official: "https://azunclaimed.gov/" },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", agency: "Arkansas Auditor of State, Unclaimed Property Division", official: "https://www.claimitar.gov/" },
  { slug: "california", name: "California", abbr: "CA", agency: "California State Controller's Office", official: "https://www.sco.ca.gov/upd_msg.html" },
  { slug: "colorado", name: "Colorado", abbr: "CO", agency: "Colorado Department of the Treasury (Great Colorado Payback)", official: "https://greatcoloradopayback.colorado.gov/" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", agency: "Connecticut Office of the State Treasurer (CTBigList)", official: "https://www.ctbiglist.com/" },
  { slug: "delaware", name: "Delaware", abbr: "DE", agency: "Delaware Office of Unclaimed Property", official: "https://unclaimedproperty.delaware.gov/" },
  { slug: "florida", name: "Florida", abbr: "FL", agency: "Florida Department of Financial Services (FLTreasureHunt)", official: "https://www.fltreasurehunt.gov/" },
  { slug: "georgia", name: "Georgia", abbr: "GA", agency: "Georgia Department of Revenue, Unclaimed Property Program", official: "https://gaclaims.dor.ga.gov/" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", agency: "Hawaii Department of Budget & Finance, Unclaimed Property Program", official: "https://unclaimedproperty.ehawaii.gov/" },
  { slug: "idaho", name: "Idaho", abbr: "ID", agency: "Idaho State Treasurer, Unclaimed Property", official: "https://yourmoney.idaho.gov/" },
  { slug: "illinois", name: "Illinois", abbr: "IL", agency: "Illinois State Treasurer (I-Cash)", official: "https://icash.illinoistreasurer.gov/" },
  { slug: "indiana", name: "Indiana", abbr: "IN", agency: "Indiana Office of the Attorney General, Unclaimed Property", official: "https://indianaunclaimed.gov/" },
  { slug: "iowa", name: "Iowa", abbr: "IA", agency: "Iowa State Treasurer (Great Iowa Treasure Hunt)", official: "https://greatiowatreasurehunt.gov/" },
  { slug: "kansas", name: "Kansas", abbr: "KS", agency: "Kansas State Treasurer, Unclaimed Property (KansasCash)", official: "https://kansascash.ks.gov/" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", agency: "Kentucky State Treasury, Unclaimed Property Division", official: "https://missingmoney.ky.gov/" },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", agency: "Louisiana Department of the Treasury, Unclaimed Property", official: "https://www.latreasury.com/Default.aspx?fromCMI=1" },
  { slug: "maine", name: "Maine", abbr: "ME", agency: "Maine Office of the State Treasurer, Unclaimed Property", official: "https://www.maineunclaimedproperty.gov/" },
  { slug: "maryland", name: "Maryland", abbr: "MD", agency: "Comptroller of Maryland, Unclaimed Property Unit", official: "https://www.marylandtaxes.gov/unclaimed-property/index.php" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", agency: "Massachusetts State Treasurer, Unclaimed Property Division", official: "https://www.findmassmoney.gov/" },
  { slug: "michigan", name: "Michigan", abbr: "MI", agency: "Michigan Department of Treasury, Unclaimed Property", official: "https://unclaimedproperty.michigan.gov/" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", agency: "Minnesota Department of Commerce, Unclaimed Property", official: "https://mn.gov/commerce/money/unclaimed-property/" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", agency: "Mississippi State Treasury, Unclaimed Property Division", official: "https://www.treasury.ms.gov/for-citizens/unclaimed-property/" },
  { slug: "missouri", name: "Missouri", abbr: "MO", agency: "Missouri State Treasurer (Show Me Money)", official: "https://showmemoney.com/" },
  { slug: "montana", name: "Montana", abbr: "MT", agency: "Montana Department of Revenue, Unclaimed Property", official: "https://mtrevenue.gov/unclaimed-property/" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", agency: "Nebraska State Treasurer, Unclaimed Property Division", official: "https://treasurer.nebraska.gov/up/" },
  { slug: "nevada", name: "Nevada", abbr: "NV", agency: "Nevada State Treasurer, Unclaimed Property", official: "https://www.nevadaunclaimedproperty.gov/" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", agency: "New Hampshire State Treasury, Abandoned Property Division", official: "https://www.nh.gov/treasury/unclaimed-property/" },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", agency: "New Jersey Department of the Treasury, Unclaimed Property", official: "https://www.unclaimedproperty.nj.gov/" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", agency: "New Mexico Taxation & Revenue Department, Unclaimed Property", official: "https://www.tax.newmexico.gov/individuals/unclaimed-property/" },
  { slug: "new-york", name: "New York", abbr: "NY", agency: "Office of the New York State Comptroller", official: "https://www.osc.ny.gov/unclaimed-funds" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", agency: "North Carolina Department of State Treasurer (NCCash)", official: "https://www.nccash.com/" },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", agency: "North Dakota Department of Trust Lands, Unclaimed Property Division", official: "https://unclaimedproperty.nd.gov/" },
  { slug: "ohio", name: "Ohio", abbr: "OH", agency: "Ohio Department of Commerce, Division of Unclaimed Funds", official: "https://unclaimedfunds.ohio.gov/" },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", agency: "Oklahoma State Treasurer, Unclaimed Property Division", official: "https://www.ok.gov/treasurer/Unclaimed_Property/" },
  { slug: "oregon", name: "Oregon", abbr: "OR", agency: "Oregon State Treasury, Unclaimed Property Program", official: "https://unclaimed.oregon.gov/" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", agency: "Pennsylvania Treasury, Bureau of Unclaimed Property", official: "https://www.patreasury.gov/unclaimed-property/" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", agency: "Rhode Island Office of the General Treasurer", official: "https://findrimoney.com/" },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", agency: "South Carolina State Treasurer's Office, Unclaimed Property", official: "https://treasurer.sc.gov/unclaimed-property/" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", agency: "South Dakota State Treasurer, Unclaimed Property Division", official: "https://southdakota.findyourunclaimedproperty.com/" },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", agency: "Tennessee Department of the Treasury (ClaimItTN)", official: "https://claimittn.gov/" },
  { slug: "texas", name: "Texas", abbr: "TX", agency: "Texas Comptroller of Public Accounts (ClaimItTexas)", official: "https://www.claimittexas.gov/" },
  { slug: "utah", name: "Utah", abbr: "UT", agency: "Utah State Treasurer, Unclaimed Property Division (MyCash)", official: "https://mycash.utah.gov/" },
  { slug: "vermont", name: "Vermont", abbr: "VT", agency: "Vermont Office of the State Treasurer", official: "https://www.vermonttreasurer.gov/content/unclaimed-property" },
  { slug: "virginia", name: "Virginia", abbr: "VA", agency: "Virginia Department of the Treasury, Unclaimed Property Program", official: "https://www.vamoneysearch.gov/" },
  { slug: "washington", name: "Washington", abbr: "WA", agency: "Washington State Department of Revenue, Unclaimed Property", official: "https://ucp.dor.wa.gov/" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", agency: "West Virginia State Treasurer's Office, Unclaimed Property Division", official: "https://www.wvunclaimedproperty.gov/" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", agency: "Wisconsin Department of Revenue, Unclaimed Property", official: "https://www.revenue.wi.gov/Pages/UnclaimedProperty/Home.aspx" },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", agency: "Wyoming State Treasurer's Office, Unclaimed Property Division", official: "https://unclaimedproperty.wyo.gov/" },
  { slug: "district-of-columbia", name: "District of Columbia", abbr: "DC", agency: "DC Office of Finance and Treasury, Unclaimed Property", official: "https://unclaimedproperty.dc.gov/" },
];

export function getState(slug: string): StateInfo | undefined {
  return STATES.find((s) => s.slug === slug);
}
