import argparse
import glob
import pandas as pd
import plotly.express as px

parser = argparse.ArgumentParser(description="Plot measurements per room")
parser.add_argument("--show", action="store_true", help="Open plots in browser instead of saving HTML files")
parser.add_argument("--pattern", default="20211101_*.csv", help="CSV filename glob pattern")
args = parser.parse_args()

files = sorted(glob.glob(args.pattern))
df = pd.concat([pd.read_csv(f, parse_dates=["@timestamp"]) for f in files], ignore_index=True)
df = df.rename(columns={"@timestamp":"ts","measure_float":"value","room_name":"room","measure_type":"type"})
df = df[df["value"].notna()]

tables = {}
for mt in sorted(df["type"].dropna().unique()):
	pivot = (
		df[df.type == mt].set_index("ts").pivot(columns="room", values="value")
	)
	pivot = pivot.resample("15min").mean().interpolate()
	tables[mt] = pivot

	fig = px.line(pivot.reset_index(), x="ts", y=pivot.columns, title=f"{mt} per room")
	fig.update_layout(legend_title_text="Rooms")
	html_file = f"{mt.replace(' ', '_')}_per_room.html"
	if args.show:

		fig.show(renderer="browser")
		print(f"Opened {mt} plot in browser")
	else:
		fig.write_html(html_file)
		print(f"Saved {html_file}")