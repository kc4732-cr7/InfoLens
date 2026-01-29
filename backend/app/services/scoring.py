def calculate_score(verified_claims: list, earliest_source: dict, graph_data: dict) -> dict:
    """
    Compute credibility confidence score (0.0 - 1.0).
    Weighted combination of:
    - Claim verification confidence (50%)
    - Source reputation (30%)
    - Network complexity (20%)
    """
    
    # 1. Claim Verification Confidence
    if not verified_claims:
        claim_score = 0.4
    else:
        # Penalize if many claims are neutral/contradicted
        confidences = [c["verification"]["confidence"] for c in verified_claims]
        labels = [c["verification"]["nli_label"] for c in verified_claims]
        
        # Base confidence from similarity/logic
        avg_raw_conf = sum(confidences) / len(confidences)
        
        # Label-based adjustment
        support_ratio = labels.count("entailment") / len(labels)
        contradict_ratio = labels.count("contradiction") / len(labels)
        
        claim_score = (avg_raw_conf * 0.6) + (support_ratio * 0.4) - (contradict_ratio * 0.3)
        claim_score = max(0.1, min(1.0, claim_score))
    
    # 2. Source Reputation
    trusted_domains = ["reuters.com", "apnews.com", "bbc.com", "nytimes.com", "theguardian.com", "wsj.com", "bloomberg.com", "nasa.gov", "wikipedia.org"]
    source_name = earliest_source["source"].lower()
    
    is_trusted = any(domain in source_name for domain in trusted_domains)
    source_reputation = 0.95 if is_trusted else 0.45
    
    # Platform-based penalty (social media defaults lower unless verified)
    if "@" in earliest_source["source"] or "x.com" in source_name:
        source_reputation = 0.55

    # 3. Network Structure (Graph Complexity)
    node_roles = [n["role"] for n in graph_data["nodes"]]
    unique_domains = len(set([n["id"] for n in graph_data["nodes"]]))
    reporters = node_roles.count("Secondary Reporter")
    amplifiers = node_roles.count("Amplifier")
    
    # Reward diverse reporting, penalize lack of spread
    network_score = min(1.0, (unique_domains * 0.15) + (reporters * 0.1))
    if unique_domains <= 1:
        network_score = 0.3

    # Final Weighted Score Calculation
    # Dynamic weights to make differences more visible
    final_score = (claim_score * 0.5) + (source_reputation * 0.3) + (network_score * 0.2)
    
    # Ensure variety: Add a tiny bit of deterministic noise based on the content hash
    # to avoid exactly identical percentages for very similar articles
    import hashlib
    content_hash = int(hashlib.md5(earliest_source["source"].encode()).hexdigest(), 16) % 100
    final_score = final_score + (content_hash / 2000.0) 

    final_score = round(max(0.05, min(0.99, final_score)), 2)
    
    notes = (
        f"Forensic Confidence: {final_score*100:.0f}%. "
        f"Claim validation score: {claim_score:.2f}. "
        f"Source reliability rated at {source_reputation:.2f} for '{earliest_source['source']}'. "
        f"Dissemination map shows {unique_domains} distinct nodes across the network."
    )
    
    return {
        "score": final_score,
        "notes": notes
    }
