<?php
/* Template Name: SSE Country Explorer */
get_header();
$locale = function_exists( 'pll_current_language' ) && 'fa' === pll_current_language() ? 'fa' : 'en';
$countries = sse_encyclopedia_get_countries( new WP_REST_Request( 'GET', '/sse/v1/countries' ) );
$countries = is_wp_error( $countries ) ? array() : $countries->get_data();
$selected_id = sanitize_key( wp_unslash( $_GET['country'] ?? '' ) );
$selected = $selected_id ? current( array_filter( $countries, static function ( $country ) use ( $selected_id ) { return strtolower( (string) $country['id'] ) === strtolower( $selected_id ); } ) ) : false;
?>
<section class="sse-hero">
<h1><?php echo esc_html( $selected ? $selected['title'] : ( 'fa' === $locale ? 'کاوشگر کشورها' : 'Country Explorer' ) ); ?></h1>
<p><?php echo esc_html( $selected ? $selected['summary'] : ( 'fa' === $locale ? 'مروری بر تجربه‌ها و شاخص‌های اقتصاد اجتماعی و همبستگی در کشورهای مختلف.' : 'Explore social and solidarity economy experiences and indicators across countries.' ) ); ?></p>
</section>
<?php if ( $selected ) : ?>
<article class="sse-card sse-country-detail"><p class="sse-muted"><?php echo esc_html( $selected['name'] ); ?> · <?php echo esc_html( $selected['id'] ); ?></p><div class="sse-article-content"><?php echo wp_kses_post( wpautop( $selected['article'] ) ); ?></div><a class="sse-button" href="<?php echo esc_url( remove_query_arg( 'country' ) ); ?>"><?php echo 'fa' === $locale ? 'بازگشت به همه کشورها' : 'Back to all countries'; ?></a></article>
<?php endif; ?>
<?php if ( $selected ) : ?><h2 class="sse-section-title"><?php echo 'fa' === $locale ? 'کشورهای دیگر' : 'Other countries'; ?></h2><?php endif; ?>
<section class="sse-toolbar" aria-label="<?php echo 'fa' === $locale ? 'جستجوی کشورها' : 'Country search'; ?>">
<label><span><?php echo 'fa' === $locale ? 'جستجو' : 'Search'; ?></span><input type="search" data-sse-country-search placeholder="<?php echo 'fa' === $locale ? 'نام کشور را وارد کنید' : 'Search by country'; ?>"></label>
</section>
<section class="sse-grid sse-country-grid">
<?php if ( $countries ) : foreach ( $countries as $country ) : ?>
<article class="sse-card sse-country-card" data-country-name="<?php echo esc_attr( strtolower( $country['name'] . ' ' . ( $country['persianName'] ?? '' ) ) ); ?>">
<h2><?php echo esc_html( 'fa' === $locale && ! empty( $country['persianName'] ) ? $country['persianName'] : $country['name'] ); ?></h2>
<?php if ( ! empty( $country['summary'] ) ) : ?><p><?php echo esc_html( $country['summary'] ); ?></p><?php endif; ?>
<a class="sse-button" href="<?php echo esc_url( add_query_arg( 'country', rawurlencode( $country['id'] ), get_permalink() ) ); ?>"><?php echo 'fa' === $locale ? 'مشاهده کشور' : 'View country'; ?></a>
</article>
<?php endforeach; else : ?><p><?php echo 'fa' === $locale ? 'هنوز پروفایل کشوری منتشر نشده است.' : 'No country profiles have been published yet.'; ?></p><?php endif; ?>
</section>
<script>
document.addEventListener('input', function (event) {
  if (!event.target.matches('[data-sse-country-search]')) return;
  var query = event.target.value.toLowerCase().trim();
  document.querySelectorAll('[data-country-name]').forEach(function (card) {
    card.hidden = query && !card.dataset.countryName.includes(query);
  });
});
</script>
<?php get_footer();
