// Official state unclaimed-property programs. Every U.S. state, DC and Puerto Rico
// run a NAUPA-member program where holders escheat dormant property to the state
// and rightful owners can search & claim it for free. The `portal` is the official
// government search site; it is always the authoritative source for that state.
// Data is public and verifiable against each state treasury / revenue department.

export type StateInfo = {
  slug: string;
  name: string;
  abbr: string;
  agency: string;
  portal: string;
};

export const STATES: StateInfo[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", agency: "Alabama State Treasury", portal: "https://unclaimed.alabama.gov/" },
  { slug: "alaska", name: "Alaska", abbr: "AK", agency: "Alaska Department of Revenue", portal: "https://unclaimedproperty.alaska.gov/" },
  { slug: "arizona", name: "Arizona", abbr: "AZ", agency: "Arizona Department of Revenue", portal: "https://azdor.gov/unclaimed-property/owners-file-claim/search-for-property" },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", agency: "Arkansas Auditor of State", portal: "https://www.claimitar.gov/" },
  { slug: "california", name: "California", abbr: "CA", agency: "California State Controller's Office", portal: "https://ucpi.sco.ca.gov/" },
  { slug: "colorado", name: "Colorado", abbr: "CO", agency: "Colorado Department of the Treasury (Great Colorado Payback)", portal: "https://colorado.findyourunclaimedproperty.com/" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", agency: "Connecticut Office of the Treasurer", portal: "https://ctbiglist.com/" },
  { slug: "delaware", name: "Delaware", abbr: "DE", agency: "Delaware Office of Unclaimed Property", portal: "https://unclaimedproperty.delaware.gov/" },
  { slug: "district-of-columbia", name: "District of Columbia", abbr: "DC", agency: "DC Office of the Chief Financial Officer", portal: "https://unclaimedproperty.dc.gov/" },
  { slug: "florida", name: "Florida", abbr: "FL", agency: "Florida Department of Financial Services", portal: "https://www.fltreasurehunt.gov/" },
  { slug: "georgia", name: "Georgia", abbr: "GA", agency: "Georgia Department of Revenue", portal: "https://gaclaims.unclaimedproperty.com/" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", agency: "Hawaii Department of Budget & Finance", portal: "https://unclaimedproperty.ehawaii.gov/" },
  { slug: "idaho", name: "Idaho", abbr: "ID", agency: "Idaho State Treasurer", portal: "https://yourmoney.idaho.gov/" },
  { slug: "illinois", name: "Illinois", abbr: "IL", agency: "Illinois State Treasurer (I-Cash)", portal: "https://icash.illinoistreasurer.gov/" },
  { slug: "indiana", name: "Indiana", abbr: "IN", agency: "Indiana Office of the Attorney General", portal: "https://indianaunclaimed.gov/" },
  { slug: "iowa", name: "Iowa", abbr: "IA", agency: "Iowa State Treasurer (Great Iowa Treasure Hunt)", portal: "https://greatiowatreasurehunt.gov/" },
  { slug: "kansas", name: "Kansas", abbr: "KS", agency: "Kansas State Treasurer", portal: "https://kansascash.ks.gov/" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", agency: "Kentucky State Treasury", portal: "https://kyclaims.unclaimedproperty.com/" },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", agency: "Louisiana Department of the Treasury", portal: "https://unclaimedproperty.la.gov/" },
  { slug: "maine", name: "Maine", abbr: "ME", agency: "Maine Office of the State Treasurer", portal: "https://www.maineunclaimedproperty.gov/" },
  { slug: "maryland", name: "Maryland", abbr: "MD", agency: "Comptroller of Maryland", portal: "https://www.marylandtaxes.gov/unclaimed-property/" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", agency: "Massachusetts State Treasurer", portal: "https://www.findmassmoney.gov/" },
  { slug: "michigan", name: "Michigan", abbr: "MI", agency: "Michigan Department of Treasury", portal: "https://unclaimedproperty.michigan.gov/" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", agency: "Minnesota Department of Commerce", portal: "https://mn.gov/commerce/unclaimed-property/" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", agency: "Mississippi State Treasury", portal: "https://www.treasury.ms.gov/unclaimed-property/" },
  { slug: "missouri", name: "Missouri", abbr: "MO", agency: "Missouri State Treasurer", portal: "https://showmemoney.com/" },
  { slug: "montana", name: "Montana", abbr: "MT", agency: "Montana Department of Revenue", portal: "https://mtrevenue.gov/unclaimed-property/" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", agency: "Nebraska State Treasurer", portal: "https://nebraskalostcash.nebraska.gov/" },
  { slug: "nevada", name: "Nevada", abbr: "NV", agency: "Nevada State Treasurer", portal: "https://www.nvup.gov/" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", agency: "New Hampshire State Treasury", portal: "https://www.nh.gov/treasury/unclaimed-property/" },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", agency: "New Jersey Unclaimed Property Administration", portal: "https://unclaimedproperty.nj.gov/" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", agency: "New Mexico Taxation & Revenue Department", portal: "https://nmclaims.unclaimedproperty.com/en/Property/SearchIndex" },
  { slug: "new-york", name: "New York", abbr: "NY", agency: "New York Office of the State Comptroller", portal: "https://www.osc.ny.gov/unclaimed-funds/" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", agency: "North Carolina Department of State Treasurer", portal: "https://www.nccash.com/" },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", agency: "North Dakota State Land Department", portal: "https://unclaimedproperty.nd.gov/" },
  { slug: "ohio", name: "Ohio", abbr: "OH", agency: "Ohio Department of Commerce, Division of Unclaimed Funds", portal: "https://unclaimedfunds.ohio.gov/" },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", agency: "Oklahoma State Treasurer", portal: "https://yourmoney.ok.gov/" },
  { slug: "oregon", name: "Oregon", abbr: "OR", agency: "Oregon State Treasury", portal: "https://unclaimed.oregon.gov/" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", agency: "Pennsylvania Treasury", portal: "https://www.patreasury.gov/unclaimed-property/" },
  { slug: "puerto-rico", name: "Puerto Rico", abbr: "PR", agency: "Oficina del Comisionado de Instituciones Financieras (OCIF)", portal: "https://ocif.pr.gov/" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", agency: "Rhode Island Office of the General Treasurer", portal: "https://findrimoney.com/" },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", agency: "South Carolina State Treasurer", portal: "https://treasurer.sc.gov/unclaimed-property/" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", agency: "South Dakota State Treasurer", portal: "https://sdtreasurer.gov/unclaimed-property/" },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", agency: "Tennessee Department of Treasury", portal: "https://claimittn.gov/" },
  { slug: "texas", name: "Texas", abbr: "TX", agency: "Texas Comptroller of Public Accounts", portal: "https://claimittexas.gov/" },
  { slug: "utah", name: "Utah", abbr: "UT", agency: "Utah State Treasurer (MyCash)", portal: "https://mycash.utah.gov/" },
  { slug: "vermont", name: "Vermont", abbr: "VT", agency: "Vermont Office of the State Treasurer", portal: "https://www.vermonttreasurer.gov/unclaimed-property/" },
  { slug: "virginia", name: "Virginia", abbr: "VA", agency: "Virginia Department of the Treasury", portal: "https://vamoneysearch.gov/" },
  { slug: "washington", name: "Washington", abbr: "WA", agency: "Washington Department of Revenue", portal: "https://ucp.dor.wa.gov/" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", agency: "West Virginia State Treasurer's Office", portal: "https://www.wvunclaimedproperty.gov/" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", agency: "Wisconsin Department of Revenue", portal: "https://www.revenue.wi.gov/Pages/UnclaimedProperty/home.aspx" },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", agency: "Wyoming State Treasurer", portal: "https://wyoming.findyourunclaimedproperty.com/" },
];

export function getState(slug: string): StateInfo | undefined {
  return STATES.find((s) => s.slug === slug);
}
