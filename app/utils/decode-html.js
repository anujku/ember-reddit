export default function decodeHtml(html) {
	return Ember.$('<div>').html(html).text();
}
