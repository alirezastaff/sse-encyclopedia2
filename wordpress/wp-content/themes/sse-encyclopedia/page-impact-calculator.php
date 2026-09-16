<?php
/* Template Name: SSE Impact Calculator */
get_header();
$locale = function_exists( 'pll_current_language' ) && 'fa' === pll_current_language() ? 'fa' : 'en';
$settings = sse_impact_get_settings();
$variables = sse_impact_get_variables();
$copy = 'fa' === $locale ? array(
  'title' => $settings['title_fa'], 'intro' => 'یک برآورد اولیه و شفاف از ارزش اجتماعی مداخله خود بسازید.', 'budget' => 'بودجه یا سرمایه‌گذاری اولیه', 'beneficiaries' => 'ذی‌نفعان مستقیم', 'jobs' => 'مشاغل ایجادشده', 'waste' => 'پسماند بازیابی‌شده', 'change' => 'نرخ تغییر', 'calculate' => 'محاسبه', 'result' => 'نتیجه ارزیابی', 'investment' => 'سرمایه‌گذاری', 'value' => 'ارزش خالص اجتماعی', 'ratio' => 'نسبت بازگشت سرمایه اجتماعی', 'note' => 'این ابزار یک برآورد غربالگری است و جایگزین ارزش‌گذاری حسابرسی‌شده نیست.'
) : array(
  'title' => $settings['title_en'], 'intro' => 'Build a transparent first estimate of the social value of your intervention.', 'budget' => 'Initial investment', 'beneficiaries' => 'Direct beneficiaries', 'jobs' => 'Jobs created', 'waste' => 'Waste recovered', 'change' => 'Change rate', 'calculate' => 'Calculate', 'result' => 'Assessment result', 'investment' => 'Investment', 'value' => 'Net social value', 'ratio' => 'SROI ratio', 'note' => 'This is a screening estimate, not an audited valuation.'
);
$defaults = array(
  'budget' => $variables['budget']['default_' . $locale] ?? 0,
  'beneficiaries' => $variables['beneficiaries']['default_' . $locale] ?? 0,
  'jobs' => $variables['jobs']['default_' . $locale] ?? 0,
  'waste' => $variables['waste']['default_' . $locale] ?? 0,
  'change' => $variables['change_rate']['default_' . $locale] ?? 0,
);
?>
<section class="sse-hero"><h1><?php echo esc_html( $copy['title'] ); ?></h1><p><?php echo esc_html( $copy['intro'] ); ?></p></section>
<form class="sse-calculator sse-card" data-sse-calculator dir="<?php echo 'fa' === $locale ? 'rtl' : 'ltr'; ?>">
<div class="sse-calculator-fields">
<?php foreach ( array( 'budget', 'beneficiaries', 'jobs', 'waste', 'change' ) as $key ) : ?><label><span><?php echo esc_html( $copy[ $key ] ); ?></span><input type="number" name="<?php echo esc_attr( $key ); ?>" min="0" step="any" value="<?php echo esc_attr( $defaults[ $key ] ); ?>"></label><?php endforeach; ?>
</div>
<button class="sse-button" type="submit"><?php echo esc_html( $copy['calculate'] ); ?></button>
</form>
<section class="sse-card sse-calculator-result" data-sse-result aria-live="polite"><h2><?php echo esc_html( $copy['result'] ); ?></h2><dl><div><dt><?php echo esc_html( $copy['investment'] ); ?></dt><dd data-result="investment">0</dd></div><div><dt><?php echo esc_html( $copy['value'] ); ?></dt><dd data-result="value">0</dd></div><div><dt><?php echo esc_html( $copy['ratio'] ); ?></dt><dd data-result="ratio">0</dd></div></dl><p class="sse-muted"><?php echo esc_html( $copy['note'] ); ?></p></section>
<script>
document.addEventListener('submit', function (event) {
  var form = event.target.closest('[data-sse-calculator]');
  if (!form) return;
  event.preventDefault();
  var value = function (key) { return Number(form.elements[key].value) || 0; };
  var investment = value('budget');
  var change = Math.min(100, value('change')) / 100;
  var outcome = (value('beneficiaries') * <?php echo esc_js( (float) ( $variables['social_proxy']['default_' . $locale] ?? 0 ) ); ?> + value('jobs') * <?php echo esc_js( (float) ( $variables['economic_proxy']['default_' . $locale] ?? 0 ) ); ?> + value('waste') * <?php echo esc_js( (float) ( $variables['environmental_proxy']['default_' . $locale] ?? 0 ) ); ?>) * change;
  var format = new Intl.NumberFormat('<?php echo esc_js( $settings['number_locale_' . $locale] ); ?>');
  document.querySelector('[data-result="investment"]').textContent = format.format(investment);
  document.querySelector('[data-result="value"]').textContent = format.format(outcome);
  document.querySelector('[data-result="ratio"]').textContent = investment > 0 ? (outcome / investment).toFixed(2) + ' : 1' : '0';
});
</script>
<?php get_footer();
